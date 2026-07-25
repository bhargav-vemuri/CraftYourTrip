const validateItineraryJSON = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.tripTitle || !data.summary || !data.days || !Array.isArray(data.days)) return false;

  for (const day of data.days) {
    if (day.day === undefined || !day.title || !day.stops || !Array.isArray(day.stops)) return false;

    for (const stop of day.stops) {
      if (!stop.id || !stop.time || !stop.name || !stop.description || !stop.duration || !stop.category) {
        return false;
      }
    }
  }

  return true;
};

module.exports = {
  validateItineraryJSON
};
