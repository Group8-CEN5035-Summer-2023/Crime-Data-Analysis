// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // change to your FastAPI server address
});

export const getAllCrimes = () => api.get('/crimes');
export const searchCrimes = (query) => api.post('/search-crimes', { query });
export const aggregateCrimes = (field) => api.get(`/aggregate-crimes/${field}`);

// add more functions if necessary
