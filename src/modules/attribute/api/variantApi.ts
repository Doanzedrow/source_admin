import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse, PaginatedResult } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { AttributeVariant } from '../data/attribute.types';

const MODULE_NAME = 'variant';

const endpoints: Record<
  'create' | 'edit' | 'delete' | 'getById' | 'switchStatus' | 'listPagination',
  Endpoint
> = {
  create: {
    endpoint: `/${MODULE_NAME}/create`,
  },
  edit: {
    endpoint: `/${MODULE_NAME}/edit/${PARAMS_KEY}`,
  },
  delete: {
    endpoint: `/${MODULE_NAME}/delete/${PARAMS_KEY}`,
  },
  getById: {
    endpoint: `/${MODULE_NAME}/get/${PARAMS_KEY}`,
  },
  switchStatus: {
    endpoint: `/${MODULE_NAME}/switchStatus/${PARAMS_KEY}`,
  },
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
};

export const variantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVariantList: builder.query<
      ApiResponse<PaginatedResult<AttributeVariant>>, 
      { page?: number; page_size?: number; attribute: string; keyword?: string }
    >({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result, _error, { attribute }) => [
        ...providesList(result, TAG_TYPES.ATTRIBUTE),
        { type: TAG_TYPES.ATTRIBUTE, id: attribute },
      ],
    }),
    createVariant: builder.mutation<ApiResponse<AttributeVariant>, { attribute: string; name: string; status: number; code: string }>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: (_result, _error, { attribute }) => [
        { type: TAG_TYPES.ATTRIBUTE, id: 'LIST' },
        { type: TAG_TYPES.ATTRIBUTE, id: attribute },
      ],
    }),
    updateVariant: builder.mutation<ApiResponse<AttributeVariant>, { id: string; attributeId: string; body: Partial<AttributeVariant> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { attributeId }) => [
        { type: TAG_TYPES.ATTRIBUTE, id: 'LIST' },
        { type: TAG_TYPES.ATTRIBUTE, id: attributeId },
      ],
    }),
    deleteVariant: builder.mutation<ApiResponse<any>, { id: string; attributeId: string }>({
      query: ({ id }) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: (_result, _error, { attributeId }) => [
        { type: TAG_TYPES.ATTRIBUTE, id: 'LIST' },
        { type: TAG_TYPES.ATTRIBUTE, id: attributeId },
      ],
    }),
    switchVariantStatus: builder.mutation<ApiResponse<any>, { id: string; attributeId: string }>({
      query: ({ id }) => ({
        url: generateEndpointVersionning(endpoints.switchStatus).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PATCH,
      }),
      invalidatesTags: (_result, _error, { attributeId }) => [
        { type: TAG_TYPES.ATTRIBUTE, id: 'LIST' },
        { type: TAG_TYPES.ATTRIBUTE, id: attributeId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVariantListQuery,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useSwitchVariantStatusMutation,
} = variantApi;
