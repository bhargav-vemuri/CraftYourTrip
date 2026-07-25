import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor for response handling (optional but good practice)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Standardize error format for the app
    const customError = new Error(
      error.response?.data?.message || error.message || 'An unexpected error occurred'
    );
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    
    return Promise.reject(customError);
  }
);

export default api;
