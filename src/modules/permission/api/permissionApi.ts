import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import { generateEndpointVersionning, PARAMS_KEY, providesList } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Permission, PermissionListResponse, PermissionResponse } from '../data/permission.types';
import type { Endpoint } from '@/utils/api';

const MODULE_NAME = 'permission';

const endpoints: Record<'list' | 'getById' | 'add' | 'edit', Endpoint> = {
  list: {
    endpoint: `/${MODULE_NAME}/list`,
  },
  getById: {
    endpoint: `/${MODULE_NAME}/get/${PARAMS_KEY}`,
  },
  add: {
    endpoint: `/${MODULE_NAME}/add`,
  },
  edit: {
    endpoint: `/${MODULE_NAME}/edit/${PARAMS_KEY}`,
  },
};

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissionList: builder.query<PermissionListResponse, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.list),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.PERMISSION),
    }),
    getPermissionById: builder.query<PermissionResponse, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.PERMISSION, id }],
    }),
    addPermission: builder.mutation<PermissionResponse, Partial<Permission>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.add),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.PERMISSION, id: 'LIST' }],
    }),
    editPermission: builder.mutation<PermissionResponse, { id: string; body: Partial<Permission> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.PERMISSION, id },
        { type: TAG_TYPES.PERMISSION, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPermissionListQuery,
  useGetPermissionByIdQuery,
  useAddPermissionMutation,
  useEditPermissionMutation,
} = permissionApi;
