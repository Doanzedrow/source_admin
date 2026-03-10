import axios from 'axios';
import { getBaseApiUrl } from '@/config/api';
import { tokenUtil } from './token';
import { RouteKey, rc } from '@/routes/routeConfig';

// Create a professional Axios Instance customized for Admin App
const axiosInstance = axios.create({
  baseURL: getBaseApiUrl(), 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenUtil.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Unauthorized access (401) - Clear token and redirect to Login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      tokenUtil.removeToken();
      tokenUtil.removeLoggedUser();
      
      // Navigate to login
      window.location.href = rc(RouteKey.Login).path;
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
