import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning } from '@/utils/api';
import type { 
  TodayStatisticsResult, 
  RecentActivity, 
  DashboardResponse,
  PaginatedResult,
  ChartNetRevenueResult,
  NetRevenueParams,
  ChartLabelTotalData,
  TopProductParams,
  TopCustomerParams
} from '../data/dashboard.types';

const MODULE_NAME = 'dashboard';
const ACTIVITY_MODULE = 'activity';

const endpoints: Record<'todayStatistics' | 'recentActivities' | 'chartNetRevenue' | 'chartTopProduct' | 'chartTopCustomer', Endpoint> = {
  todayStatistics: {
    endpoint: `/${MODULE_NAME}/today-statistics`,
  },
  recentActivities: {
    endpoint: `/${ACTIVITY_MODULE}/list-pagination`,
  },
  chartNetRevenue: {
    endpoint: `/${MODULE_NAME}/chart-net-revenue`,
  },
  chartTopProduct: {
    endpoint: `/${MODULE_NAME}/chart-top-product`,
  },
  chartTopCustomer: {
    endpoint: `/${MODULE_NAME}/chart-top-customer`,
  },
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatistics: builder.query<DashboardResponse<TodayStatisticsResult>, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.todayStatistics),
        method: HTTP_METHOD.GET,
      }),
    }),
    getRecentActivities: builder.query<DashboardResponse<PaginatedResult<RecentActivity>>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.recentActivities),
        method: HTTP_METHOD.GET,
        params,
      }),
    }),
    getChartNetRevenue: builder.query<DashboardResponse<ChartNetRevenueResult>, NetRevenueParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.chartNetRevenue),
        method: HTTP_METHOD.GET,
        params,
      }),
    }),
    getTopProducts: builder.query<DashboardResponse<ChartLabelTotalData[]>, TopProductParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.chartTopProduct),
        method: HTTP_METHOD.GET,
        params,
      }),
    }),
    getTopCustomers: builder.query<DashboardResponse<ChartLabelTotalData[]>, TopCustomerParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.chartTopCustomer),
        method: HTTP_METHOD.GET,
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetTodayStatisticsQuery, 
  useGetRecentActivitiesQuery,
  useGetChartNetRevenueQuery,
  useGetTopProductsQuery,
  useGetTopCustomersQuery
} = dashboardApi;
