import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse, PaginatedResult } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Category } from '../data/category.types';

const MODULE_NAME = 'category';

const endpoints: Record<'listPagination' | 'switchStatus' | 'create' | 'edit' | 'getById' | 'getAll', Endpoint> = {
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
  getAll: {
    endpoint: `/${MODULE_NAME}/getAll`,
  },
};

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategoryList: builder.query<ApiResponse<PaginatedResult<Category>>, { page?: number; page_size?: number }>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.CATEGORY),
    }),
    getAllCategories: builder.query<ApiResponse<Category[]>, { type?: number } | void>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.getAll),
        method: HTTP_METHOD.GET,
        params,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.CATEGORY),
    }),
    getCategoryById: builder.query<ApiResponse<Category>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.CATEGORY, id }],
    }),
    createCategory: builder.mutation<ApiResponse<Category>, Partial<Category>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.CATEGORY, id: 'LIST' }],
    }),
    updateCategory: builder.mutation<ApiResponse<Category>, { id: string; body: Partial<Category> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.CATEGORY, id },
        { type: TAG_TYPES.CATEGORY, id: 'LIST' },
      ],
    }),
    switchCategoryStatus: builder.mutation<ApiResponse<any>, { id: string; status: number }>({
      query: ({ id, status }) => ({
        url: `${generateEndpointVersionning(endpoints.switchStatus)}/${id}`,
        method: HTTP_METHOD.PATCH,
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.CATEGORY, id },
        { type: TAG_TYPES.CATEGORY, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoryListQuery,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useSwitchCategoryStatusMutation,
} = categoryApi;
