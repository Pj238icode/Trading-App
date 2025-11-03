import axios from 'axios';

const DEPLOYED = 'https://trading-app-trh2.onrender.com';
const LOCALHOST = 'http://localhost:8080';

export const API_BASE_URL = DEPLOYED;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor ensures the newest token is always used
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
