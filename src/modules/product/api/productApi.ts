import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning } from '@/utils/api';
import type { Product, PaginatedResult } from '../data/product.types';

const MODULE_NAME = 'product';

const endpoints: Record<'listPagination', Endpoint> = {
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
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
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductListQuery } = productApi;
