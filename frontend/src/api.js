import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export const getAllCrimes = () => api.get("/crimes");
export const getYearRange = () => api.get("/crimes/year-range");
export const aggregateCrimes = (field) => api.get(`/crimes/${field}`);
export const getPopulation = () => api.get("/crime-trends");
