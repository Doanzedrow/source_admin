import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Product, PaginatedResult } from '../data/product.types';

const MODULE_NAME = 'product';

const endpoints: Record<'listPagination' | 'switchStatus' | 'create' | 'update', Endpoint> = {
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
  switchStatus: {
    endpoint: `/${MODULE_NAME}/switchStatus`,
  },
  create: {
    endpoint: `/${MODULE_NAME}`,
  },
  update: {
    endpoint: `/${MODULE_NAME}`,
  },
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query<ApiResponse<PaginatedResult<Product>>, { page?: number; page_size?: number }>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params,
      }),
      providesTags: (result) =>
        result?.result?.data
          ? [
              ...result.result.data.map(({ _id }) => ({ type: TAG_TYPES.PRODUCT, id: _id })),
              { type: TAG_TYPES.PRODUCT, id: 'LIST' },
            ]
          : [{ type: TAG_TYPES.PRODUCT, id: 'LIST' }],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.PRODUCT, id: 'LIST' }],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { id: string; body: Partial<Product> }>({
      query: ({ id, body }) => ({
        url: `${generateEndpointVersionning(endpoints.update)}/${id}`,
        method: HTTP_METHOD.PUT,
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.PRODUCT, id },
        { type: TAG_TYPES.PRODUCT, id: 'LIST' },
      ],
    }),
    switchStatus: builder.mutation<ApiResponse<any>, { id: string; status: number }>({
      query: ({ id, status }) => ({
        url: `${generateEndpointVersionning(endpoints.switchStatus)}/${id}`,
        method: HTTP_METHOD.PATCH,
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.PRODUCT, id },
        { type: TAG_TYPES.PRODUCT, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetProductListQuery, 
  useSwitchStatusMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productApi;
