import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse, PaginatedResult } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Attribute } from '../data/attribute.types';

const MODULE_NAME = 'attribute';

const endpoints: Record<
  | 'listPagination'
  | 'list'
  | 'create'
  | 'edit'
  | 'getById'
  | 'delete'
  | 'batchDelete'
  | 'import'
  | 'export',
  Endpoint
> = {
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
  list: {
    endpoint: `/${MODULE_NAME}/list`,
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
  import: {
    endpoint: `/${MODULE_NAME}/import`,
  },
  export: {
    endpoint: `/${MODULE_NAME}/export`,
  },
};

export const generateAttributeExportUrl = () => {
  return generateEndpointVersionning(endpoints.export);
};

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributeList: builder.query<
      ApiResponse<PaginatedResult<Attribute>>, 
      { page?: number; page_size?: number; keyword?: string; status?: number; branchId?: string }
    >({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.ATTRIBUTE),
    }),
    getAllAttributes: builder.query<ApiResponse<Attribute[]>, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.list),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.ATTRIBUTE),
    }),
    getAttributeById: builder.query<ApiResponse<Attribute>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.ATTRIBUTE, id }],
    }),
    createAttribute: builder.mutation<ApiResponse<Attribute>, Partial<Attribute>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ATTRIBUTE, id: 'LIST' }],
    }),
    updateAttribute: builder.mutation<ApiResponse<Attribute>, { id: string; body: Partial<Attribute> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.ATTRIBUTE, id },
        { type: TAG_TYPES.ATTRIBUTE, id: 'LIST' },
      ],
    }),
    deleteAttribute: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ATTRIBUTE, id: 'LIST' }],
    }),
    batchDeleteAttributes: builder.mutation<ApiResponse<any>, string[]>({
      query: (ids) => ({
        url: generateEndpointVersionning(endpoints.batchDelete),
        method: HTTP_METHOD.DELETE,
        data: { ids },
      }),
      invalidatesTags: [{ type: TAG_TYPES.ATTRIBUTE, id: 'LIST' }],
    }),
    importAttribute: builder.mutation<ApiResponse<any>, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: generateEndpointVersionning(endpoints.import),
          method: HTTP_METHOD.POST,
          data: formData,
        };
      },
      invalidatesTags: [{ type: TAG_TYPES.ATTRIBUTE, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetAttributeListQuery,
  useGetAllAttributesQuery,
  useGetAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
  useBatchDeleteAttributesMutation,
  useImportAttributeMutation,
} = attributeApi;
