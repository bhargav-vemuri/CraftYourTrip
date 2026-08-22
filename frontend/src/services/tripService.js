import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const tripService = {
  generateTrip: async (tripDetails, signal) => {
    try {
      const response = await axios.post(`${API_URL}/trips/generate`, tripDetails, {
        signal,
        headers: { 'Content-Type': 'application/json' },
        timeout: 65000 
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw { isCancelled: true };
      }
      throw error.response?.data || error;
    }
  },

  optimizeDay: async (dayContext, constraints, destination) => {
    try {
      const response = await axios.post(`${API_URL}/trips/optimize`, {
        dayContext,
        constraints,
        destination
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000 
      });
      return response.data.day;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  replaceStop: async (stopContext, itineraryContext, instruction, destination) => {
    try {
      const response = await axios.post(`${API_URL}/trips/replace`, {
        stopContext,
        itineraryContext,
        instruction,
        destination
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000 
      });
      return response.data.stop;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
