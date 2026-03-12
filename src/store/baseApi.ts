import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axiosInstance from '@/utils/axiosInstance';
import type { AxiosRequestConfig } from 'axios';
import { TAG_TYPES } from './tags';

import { tokenUtil } from '@/utils/token';

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
    async ({ url, method = 'GET', data, params, headers }) => {
      const token = tokenUtil.getToken();
      const isPublic = url.includes('/auth/login') || url.includes('/auth/refresh-token');

      if (!token && !isPublic) {
        return {
          error: {
            status: 401,
            message: 'Authentication required',
          },
        };
      }

      try {
        const result = await axiosInstance({
          url: baseUrl + url,
          method,
          data,
          params,
          headers,
        });

        return { data: result };
      } catch (axiosError) {
        const err = axiosError as any;
        const responseData = err.response?.data;

        return {
          error: {
            status: err.response?.status,
            message: responseData?.error || responseData?.message || err.message,
            debug: responseData?.debug,
          },
        };
      }
    };

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: axiosBaseQuery({ baseUrl: '' }),
  tagTypes: Object.values(TAG_TYPES).filter((k) => typeof k === 'string'),
  endpoints: () => ({}),
});
