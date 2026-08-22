const axios = require('axios');

const calculateRoute = async (originCoords, destCoords) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return null;
  }
  
  if (!originCoords || !destCoords) {
    return null;
  }

  try {
    const response = await axios.post(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        origin: {
          location: {
            latLng: {
              latitude: originCoords.lat,
              longitude: originCoords.lng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destCoords.lat,
              longitude: destCoords.lng
            }
          }
        },
        travelMode: 'TRANSIT', // Default to transit for inner-city travel. We can refine this later or try multiple
        computeAlternativeRoutes: false
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
        },
        timeout: 3000
      }
    );

    let route = response.data.routes?.[0];
    let mode = 'Transit';

    // If transit fails, fallback to driving
    if (!route) {
      const driveResponse = await axios.post(
        'https://routes.googleapis.com/directions/v2:computeRoutes',
        {
          origin: { location: { latLng: { latitude: originCoords.lat, longitude: originCoords.lng } } },
          destination: { location: { latLng: { latitude: destCoords.lat, longitude: destCoords.lng } } },
          travelMode: 'DRIVE'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
          },
          timeout: 3000
        }
      );
      route = driveResponse.data.routes?.[0];
      mode = 'Driving';
    }

    if (route) {
      // route.duration is like "1800s". Distance is in meters.
      const seconds = parseInt(route.duration.replace('s', ''));
      let durationStr = '';
      if (seconds < 3600) {
        durationStr = `${Math.ceil(seconds / 60)} min`;
      } else {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.ceil((seconds % 3600) / 60);
        durationStr = `${hrs}h ${mins > 0 ? mins + 'm' : ''}`;
      }

      const distanceKm = (route.distanceMeters / 1000).toFixed(1);

      return {
        distance: `${distanceKm} km`,
        duration: durationStr,
        mode: mode
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to calculate route:`, error.message);
    return null; // Graceful degradation
  }
};

module.exports = {
  calculateRoute
};
