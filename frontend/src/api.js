// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // change to your FastAPI server address
});

export const getAllCrimes = () => api.get('/crimes');
export const getYearRange = () => api.get('/crimes/year-range');
export const searchCrimes = (query) => api.post('/search-crimes', { query });
export const aggregateCrimes = (field) => api.get(`/crimes/${field}`);
export const getPopulation = () => api.get(`/population`);

// add more functions if necessary
