import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Order, PaginatedOrderResult, OrderListParams } from '../data/order.types';

const MODULE_NAME = 'order';

const endpoints: Record<
  | 'listPagination'
  | 'getById'
  | 'delete'
  | 'batchDelete'
  | 'export',
  Endpoint
> = {
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
  getById: {
    endpoint: `/${MODULE_NAME}/get/${PARAMS_KEY}`,
  },
  delete: {
    endpoint: `/${MODULE_NAME}/delete/${PARAMS_KEY}`,
  },
  batchDelete: {
    endpoint: `/${MODULE_NAME}/batchDelete`,
  },
  export: {
    endpoint: `/${MODULE_NAME}/export`,
  },
};

export const generateOrderExportUrl = () => {
  return generateEndpointVersionning(endpoints.export);
};

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderList: builder.query<ApiResponse<PaginatedOrderResult>, OrderListParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.ORDER),
    }),
    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.ORDER, id }],
    }),
    deleteOrder: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ORDER, id: 'LIST' }],
    }),
    batchDeleteOrders: builder.mutation<ApiResponse<any>, string[]>({
      query: (ids) => ({
        url: generateEndpointVersionning(endpoints.batchDelete),
        method: HTTP_METHOD.DELETE,
        data: { ids },
      }),
      invalidatesTags: [{ type: TAG_TYPES.ORDER, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrderListQuery,
  useGetOrderByIdQuery,
  useDeleteOrderMutation,
  useBatchDeleteOrdersMutation,
} = orderApi;
