const { generateItinerary, optimizeDay, replaceStop } = require('../services/geminiService');
const { resolvePlace } = require('../services/placesService');
const { calculateRoute } = require('../services/routesService');
const { getWeather } = require('../services/weatherService');
const { extractJSON } = require('../utils/extractJSON');
const { itinerarySchema, daySchema, stopSchema } = require('../validators/itinerarySchema');

/**
 * Helper to enrich a list of stops with Google Places and Routes
 */
const enrichStopsAndRoutes = async (stops, destination) => {
  // 1. Resolve Places in parallel
  const placePromises = stops.map(async (stop) => {
    const placeData = await resolvePlace(stop.name, destination, stop.category);
    if (placeData) {
      stop.placeId = placeData.placeId;
      stop.coordinates = placeData.coordinates;
      stop.rating = placeData.rating;
      stop.address = placeData.address;
    }
    return stop;
  });
  
  const enrichedStops = await Promise.all(placePromises);

  // 2. Calculate Routes sequentially (between consecutive stops)
  for (let i = 1; i < enrichedStops.length; i++) {
    const prev = enrichedStops[i - 1];
    const curr = enrichedStops[i];
    
    if (prev.coordinates && curr.coordinates) {
      const routeData = await calculateRoute(prev.coordinates, curr.coordinates);
      if (routeData) {
        curr.travelInfo = routeData;
      }
    }
  }

  return enrichedStops;
};

const generateTrip = async (req, res) => {
  try {
    const tripDetails = req.body;

    // 1. Generate Raw JSON from Gemini
    const rawResponseText = await generateItinerary(tripDetails);
    const parsedJSON = extractJSON(rawResponseText);
    
    if (!parsedJSON) {
      return res.status(500).json({ success: false, error: 'Unable to parse AI response.' });
    }

    // 2. Validate Schema
    const validationResult = itinerarySchema.safeParse(parsedJSON);
    if (!validationResult.success) {
      return res.status(500).json({ success: false, error: 'AI returned an invalid itinerary schema.' });
    }

    const itinerary = validationResult.data;

    // 3. Resolve Destination for Weather
    let destinationCoords = null;
    const destPlace = await resolvePlace(itinerary.destination, itinerary.destination, 'City');
    if (destPlace && destPlace.coordinates) {
      destinationCoords = destPlace.coordinates;
      // 4. Fetch Weather
      const weatherForecast = await getWeather(destinationCoords.lat, destinationCoords.lng, itinerary.days.length);
      
      if (weatherForecast) {
        itinerary.days.forEach((day, idx) => {
          if (weatherForecast[idx]) {
            day.weather = weatherForecast[idx];
          }
        });
      }
    }

    // 5. Enrich Stops & Routes
    for (let day of itinerary.days) {
      day.stops = await enrichStopsAndRoutes(day.stops, itinerary.destination);
      
      // Calculate total travel time for the day based on enriched routes
      let totalSeconds = 0;
      day.stops.forEach(s => {
        if (s.travelInfo && s.travelInfo.duration) {
          // Parse duration string (e.g. "1h 30m" or "45 min")
          const str = s.travelInfo.duration;
          let hrs = 0; let mins = 0;
          if (str.includes('h')) hrs = parseInt(str.split('h')[0]) || 0;
          if (str.includes('min') || str.includes('m')) {
            const minPart = str.includes('min') ? str.split('min')[0] : str.split('h')[1]?.split('m')[0];
            mins = parseInt(minPart) || 0;
          }
          totalSeconds += (hrs * 3600) + (mins * 60);
        }
      });
      if (totalSeconds > 0) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        day.totalTravelTime = h > 0 ? \`\${h}h \${m}m\` : \`\${m} min\`;
      }
    }

    return res.status(200).json({ success: true, itinerary });
    
  } catch (error) {
    if (error.code === 'TIMEOUT') return res.status(504).json({ success: false, error: 'The request timed out.' });
    console.error('Trip Generation Error:', error);
    return res.status(500).json({ success: false, error: 'An unexpected backend failure occurred.' });
  }
};

const handleOptimizeDay = async (req, res) => {
  try {
    const { dayContext, constraints, destination } = req.body;

    const rawResponse = await optimizeDay(dayContext, constraints);
    const parsedJSON = extractJSON(rawResponse);
    if (!parsedJSON) return res.status(500).json({ success: false, error: 'Unable to parse optimization response.' });

    const validationResult = daySchema.safeParse(parsedJSON);
    if (!validationResult.success) return res.status(500).json({ success: false, error: 'Optimization returned invalid day schema.' });

    const optimizedDay = validationResult.data;
    
    // Maintain old weather
    optimizedDay.weather = dayContext.weather;

    // Enrich the newly arranged stops
    optimizedDay.stops = await enrichStopsAndRoutes(optimizedDay.stops, destination);

    return res.status(200).json({ success: true, day: optimizedDay });
  } catch (error) {
    if (error.code === 'TIMEOUT') return res.status(504).json({ success: false, error: 'The request timed out.' });
    console.error('Day Optimization Error:', error);
    return res.status(500).json({ success: false, error: 'Optimization failed.' });
  }
};

const handleReplaceStop = async (req, res) => {
  try {
    const { stopContext, itineraryContext, instruction, destination } = req.body;

    const rawResponse = await replaceStop(stopContext, itineraryContext, instruction);
    const parsedJSON = extractJSON(rawResponse);
    if (!parsedJSON) return res.status(500).json({ success: false, error: 'Unable to parse replacement response.' });

    const validationResult = stopSchema.safeParse(parsedJSON);
    if (!validationResult.success) return res.status(500).json({ success: false, error: 'Replacement returned invalid stop schema.' });

    let newStop = validationResult.data;
    
    // Enrich just this stop
    const [enrichedStop] = await enrichStopsAndRoutes([newStop], destination);
    newStop = enrichedStop;

    return res.status(200).json({ success: true, stop: newStop });
  } catch (error) {
    if (error.code === 'TIMEOUT') return res.status(504).json({ success: false, error: 'The request timed out.' });
    console.error('Stop Replacement Error:', error);
    return res.status(500).json({ success: false, error: 'Replacement failed.' });
  }
};

module.exports = {
  generateTrip,
  handleOptimizeDay,
  handleReplaceStop
};
