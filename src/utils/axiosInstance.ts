import axios from 'axios';
import { getBaseApiUrl } from '@/config/api';

// Create a professional Axios Instance customized for Admin App
const axiosInstance = axios.create({
  baseURL: getBaseApiUrl(), // ==> Tự động gắn thành https://api.spa.test.zinisoft.net/api/v1.0
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
axiosInstance.interceptors.request.use(
  (config) => {
    // Read from localStorage or wherever stored
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Refresh token & Global Errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap response data if consistent API response body wrapper
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Bắt lỗi 401 (Hết Session / Sai Token) để đá văng ra ngoài Login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
