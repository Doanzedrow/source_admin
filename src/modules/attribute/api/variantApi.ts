import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { AttributeVariant } from '../data/attribute.types';

const MODULE_NAME = 'variant';

const endpoints: Record<
  'create' | 'edit' | 'delete' | 'getById',
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
};

export const variantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createVariant: builder.mutation<ApiResponse<AttributeVariant>, { attribute: string; name: string; status: number }>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ATTRIBUTE, id: 'LIST' }],
    }),
    updateVariant: builder.mutation<ApiResponse<AttributeVariant>, { id: string; body: Partial<AttributeVariant> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: () => [
        { type: TAG_TYPES.ATTRIBUTE, id: 'LIST' },
      ],
    }),
    deleteVariant: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ATTRIBUTE, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
} = variantApi;
