import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URL } from '@/config/constants';
import { tokenUtil } from './token';
import { RouteKey, rc } from '@/routes/routeConfig';

const axiosInstance = axios.create({
  baseURL: (API_URL || '').replace(/\/$/, ""),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtil.getToken();
    
    // Public endpoints that don't need a token
    const publicEndpoints = ['/auth/login', '/auth/refresh-token'];
    const isPublic = publicEndpoints.some(endpoint => config.url?.includes(endpoint));

    if (!token && !isPublic) {
      // Return a rejected promise to stop the request before it leaves
      return Promise.reject({
        message: 'No authentication token found',
        config
      });
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const responseData = error.response?.data as any;

    const errorMessage = responseData?.error || responseData?.message || error.message;

    (error as any).processedError = errorMessage;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const loginPath = rc(RouteKey.Login).path;
      const isAlreadyOnLogin = window.location.pathname === loginPath;

      if (!isAlreadyOnLogin) {
        tokenUtil.removeToken();
        tokenUtil.removeLoggedUser();
        window.location.replace(loginPath);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
