import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { 
  TodayStatisticsResult, 
  RecentActivity, 
  DashboardResponse,
  PaginatedResult,
  ChartNetRevenueResult,
  NetRevenueParams,
  ChartLabelTotalData,
  TopProductParams,
  TopCustomerParams,
  DashboardOrder,
  DashboardOrderParams
} from '../data/dashboard.types';

const MODULE_NAME = 'dashboard';
const ACTIVITY_MODULE = 'activity';

const endpoints: Record<'todayStatistics' | 'recentActivities' | 'chartNetRevenue' | 'chartTopProduct' | 'chartTopCustomer' | 'orders' | 'draftOrders', Endpoint> = {
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
  orders: {
    endpoint: `/${MODULE_NAME}/order`,
  },
  draftOrders: {
    endpoint: `/${MODULE_NAME}/draftOrder`,
  },
};

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodayStatistics: builder.query<DashboardResponse<TodayStatisticsResult>, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.todayStatistics),
        method: HTTP_METHOD.GET,
      }),
      providesTags: [{ type: TAG_TYPES.DASHBOARD, id: 'STATISTICS' }],
    }),
    getRecentActivities: builder.query<DashboardResponse<PaginatedResult<RecentActivity>>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.recentActivities),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result?.result?.data
          ? [
              ...result.result.data.map(({ _id }) => ({ type: TAG_TYPES.DASHBOARD, id: _id })),
              { type: TAG_TYPES.DASHBOARD, id: 'ACTIVITY_LIST' },
            ]
          : [{ type: TAG_TYPES.DASHBOARD, id: 'ACTIVITY_LIST' }],
    }),
    getChartNetRevenue: builder.query<DashboardResponse<ChartNetRevenueResult>, NetRevenueParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.chartNetRevenue),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: [{ type: TAG_TYPES.DASHBOARD, id: 'CHART_REVENUE' }],
    }),
    getTopProducts: builder.query<DashboardResponse<ChartLabelTotalData[]>, TopProductParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.chartTopProduct),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: [{ type: TAG_TYPES.DASHBOARD, id: 'TOP_PRODUCTS' }],
    }),
    getTopCustomers: builder.query<DashboardResponse<ChartLabelTotalData[]>, TopCustomerParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.chartTopCustomer),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: [{ type: TAG_TYPES.DASHBOARD, id: 'TOP_CUSTOMERS' }],
    }),
    getDashboardOrders: builder.query<DashboardResponse<PaginatedResult<DashboardOrder>>, DashboardOrderParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.orders),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result?.result?.data
          ? [
              ...result.result.data.map(({ _id }) => ({ type: TAG_TYPES.ORDER, id: _id })),
              { type: TAG_TYPES.ORDER, id: 'LIST' },
            ]
          : [{ type: TAG_TYPES.ORDER, id: 'LIST' }],
    }),
    getDashboardDraftOrders: builder.query<DashboardResponse<PaginatedResult<DashboardOrder>>, DashboardOrderParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.draftOrders),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) =>
        result?.result?.data
          ? [
              ...result.result.data.map(({ _id }) => ({ type: TAG_TYPES.ORDER, id: _id })),
              { type: TAG_TYPES.ORDER, id: 'DRAFT_LIST' },
            ]
          : [{ type: TAG_TYPES.ORDER, id: 'DRAFT_LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetTodayStatisticsQuery, 
  useGetRecentActivitiesQuery,
  useGetChartNetRevenueQuery,
  useGetTopProductsQuery,
  useGetTopCustomersQuery,
  useGetDashboardOrdersQuery,
  useGetDashboardDraftOrdersQuery
} = dashboardApi;
