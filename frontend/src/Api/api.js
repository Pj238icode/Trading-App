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

// ✅ Always attach the latest valid token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token && token !== 'null' && token !== 'undefined') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🟢 Sending JWT:', token.substring(0, 20) + '...'); // Optional debug
    } else {
      delete config.headers.Authorization; // 🔥 Prevent "Bearer null"
      console.warn('⚠️ No valid JWT found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
