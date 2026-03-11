import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse } from '@/types/api';
import { TAG_TYPES } from '@/store/tags';
import type { Category } from '../data/category.types';

const MODULE_NAME = 'category';

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => ({
        url: `/v1.0/${MODULE_NAME}/getAll`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) =>
        result?.result
          ? [
              ...result.result.map(({ _id }) => ({ type: TAG_TYPES.CATEGORY, id: _id })),
              { type: TAG_TYPES.CATEGORY, id: 'LIST' },
            ]
          : [{ type: TAG_TYPES.CATEGORY, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllCategoriesQuery } = categoryApi;
