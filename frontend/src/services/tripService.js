import api from './api';

export const tripService = {
  generateTrip: async (tripData, signal) => {
    return await api.post('/trips/generate', tripData, { signal });
  }
};
