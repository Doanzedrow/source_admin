import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse, PaginatedResult } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Product } from '../data/product.types';

const MODULE_NAME = 'product';

const endpoints: Record<
  | 'listPagination'
  | 'switchStatus'
  | 'create'
  | 'edit'
  | 'getById'
  | 'delete'
  | 'batchDelete'
  | 'editMultiple',
  Endpoint
> = {
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
  switchStatus: {
    endpoint: `/${MODULE_NAME}/switchStatus`,
  },
  create: {
    endpoint: `/${MODULE_NAME}/create`,
  },
  edit: {
    endpoint: `/${MODULE_NAME}/edit/${PARAMS_KEY}`,
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
  editMultiple: {
    endpoint: `/${MODULE_NAME}/multiple`,
  },
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query<
      ApiResponse<PaginatedResult<Product>>, 
      { page?: number; page_size?: number; keyword?: string; category?: string; status?: number }
    >({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.PRODUCT),
    }),
    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.PRODUCT, id }],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, Partial<Product>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.PRODUCT, id: 'LIST' }],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { id: string; body: Partial<Product> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
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
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.PRODUCT, id },
        { type: TAG_TYPES.PRODUCT, id: 'LIST' },
      ],
    }),
    deleteProduct: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.PRODUCT, id: 'LIST' }],
    }),
    batchDeleteProducts: builder.mutation<ApiResponse<any>, string[]>({
      query: (productIds) => ({
        url: generateEndpointVersionning(endpoints.batchDelete),
        method: HTTP_METHOD.DELETE,
        data: { productIds },
      }),
      invalidatesTags: [{ type: TAG_TYPES.PRODUCT, id: 'LIST' }],
    }),
    batchUpdateStatus: builder.mutation<ApiResponse<any>, { productIds: string[]; status: number }>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.editMultiple),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.PRODUCT, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetProductListQuery, 
  useGetProductByIdQuery,
  useSwitchStatusMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useBatchDeleteProductsMutation,
  useBatchUpdateStatusMutation,
} = productApi;
