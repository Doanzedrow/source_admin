import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse, PaginatedResult } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Service } from '../data/service.types';

const MODULE_NAME = 'service';

const endpoints: Record<
  | 'listPagination'
  | 'switchStatus'
  | 'create'
  | 'edit'
  | 'getById'
  | 'delete'
  | 'batchDelete'
  | 'editMultiple'
  | 'import'
  | 'export',
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
  import: {
    endpoint: `/${MODULE_NAME}/import`,
  },
  export: {
    endpoint: `/${MODULE_NAME}/export`,
  },
};

export const generateServiceExportUrl = () => {
  return generateEndpointVersionning(endpoints.export);
};

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceList: builder.query<
      ApiResponse<PaginatedResult<Service>>, 
      { page?: number; page_size?: number; keyword?: string; category?: string; status?: number; branchId?: string }
    >({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams({ ...params, type: 2 }),
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.SERVICE),
    }),
    getServiceById: builder.query<ApiResponse<Service>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SERVICE, id }],
    }),
    createService: builder.mutation<ApiResponse<Service>, Partial<Service>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.create),
        method: HTTP_METHOD.POST,
        data: { ...body, type: 2 },
      }),
      invalidatesTags: [{ type: TAG_TYPES.SERVICE, id: 'LIST' }],
    }),
    updateService: builder.mutation<ApiResponse<Service>, { id: string; body: Partial<Service> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.SERVICE, id },
        { type: TAG_TYPES.SERVICE, id: 'LIST' },
      ],
    }),
    switchServiceStatus: builder.mutation<ApiResponse<any>, { id: string; status: number }>({
      query: ({ id, status }) => ({
        url: `${generateEndpointVersionning(endpoints.switchStatus)}/${id}`,
        method: HTTP_METHOD.PATCH,
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.SERVICE, id },
        { type: TAG_TYPES.SERVICE, id: 'LIST' },
      ],
    }),
    deleteService: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.SERVICE, id: 'LIST' }],
    }),
    batchDeleteServices: builder.mutation<ApiResponse<any>, string[]>({
      query: (productIds) => ({
        url: generateEndpointVersionning(endpoints.batchDelete),
        method: HTTP_METHOD.DELETE,
        data: { productIds },
      }),
      invalidatesTags: [{ type: TAG_TYPES.SERVICE, id: 'LIST' }],
    }),
    batchUpdateServiceStatus: builder.mutation<ApiResponse<any>, { productIds: string[]; status: number }>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.editMultiple),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.SERVICE, id: 'LIST' }],
    }),
    importService: builder.mutation<ApiResponse<any>, FormData>({
      query: (formData) => ({
        url: generateEndpointVersionning(endpoints.import),
        method: HTTP_METHOD.POST,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: [{ type: TAG_TYPES.SERVICE, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetServiceListQuery, 
  useGetServiceByIdQuery,
  useSwitchServiceStatusMutation,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useBatchDeleteServicesMutation,
  useBatchUpdateServiceStatusMutation,
  useImportServiceMutation,
} = serviceApi;
