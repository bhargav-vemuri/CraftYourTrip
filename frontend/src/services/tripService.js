import api from './api';

export const tripService = {
  /**
   * Send a trip generation request to the backend
   * @param {Object} tripData 
   * @returns {Promise<Object>} Backend response
   */
  generateTrip: async (tripData) => {
    return await api.post('/trips/generate', tripData);
  }
};
