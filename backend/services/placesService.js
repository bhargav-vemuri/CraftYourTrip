const axios = require('axios');

const resolvePlace = async (stopName, destination, category) => {
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    console.warn('Missing GOOGLE_MAPS_API_KEY. Skipping place resolution.');
    return null;
  }

  try {
    const searchQuery = `${stopName} in ${destination}`;
    
    // We use the new Places API (Text Search)
    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: searchQuery
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating'
        },
        timeout: 5000 // 5 second timeout so a bad map request doesn't ruin the itinerary
      }
    );

    if (response.data.places && response.data.places.length > 0) {
      const place = response.data.places[0]; // Take the best match
      
      return {
        placeId: place.id,
        name: place.displayName?.text || stopName,
        address: place.formattedAddress,
        coordinates: place.location ? {
          lat: place.location.latitude,
          lng: place.location.longitude
        } : null,
        rating: place.rating || null
      };
    }
    
    return null; // Ambiguous or non-existent
  } catch (error) {
    console.error(`Failed to resolve place ${stopName}:`, error.message);
    return null; // Do not destroy itinerary on failure
  }
};

module.exports = {
  resolvePlace
};
