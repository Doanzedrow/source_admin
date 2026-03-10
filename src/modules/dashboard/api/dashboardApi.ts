import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning } from '@/utils/api';

const MODULE_NAME = 'dashboard';
const ACTIVITY_MODULE = 'activity';

const endpoints: Record<'todayStatistics' | 'recentActivities', Endpoint> = {
  todayStatistics: {
    endpoint: `/${MODULE_NAME}/today-statistics`,
  },
  recentActivities: {
    endpoint: `/${ACTIVITY_MODULE}/list-pagination`,
  },
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatistics: builder.query<any, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.todayStatistics),
        method: HTTP_METHOD.GET,
      }),
    }),
    getRecentActivities: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.recentActivities),
        method: HTTP_METHOD.GET,
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTodayStatisticsQuery, useGetRecentActivitiesQuery } = dashboardApi;
