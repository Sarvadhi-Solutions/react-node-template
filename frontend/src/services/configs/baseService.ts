import axios from 'axios';
import { APP_CONFIG } from './app.config';

const baseService = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
baseService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 auth errors
baseService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthRoute =
        url.includes('/auth/login') || url.includes('/auth/set-password');
      if (!isAuthRoute) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('persist:app');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default baseService;
