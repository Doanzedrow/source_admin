import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import { generateEndpointVersionning, PARAMS_KEY, providesList } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Role, RoleListResponse, RoleResponse } from '../data/role.types';
import type { Endpoint } from '@/utils/api';

const MODULE_NAME = 'role';

const endpoints: Record<'list' | 'getById' | 'add' | 'edit' | 'delete', Endpoint> = {
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
  delete: {
    endpoint: `/${MODULE_NAME}/delete/${PARAMS_KEY}`,
  },
};

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoleList: builder.query<RoleListResponse, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.list),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.ROLE),
    }),
    getRoleById: builder.query<RoleResponse, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.ROLE, id }],
    }),
    addRole: builder.mutation<RoleResponse, Partial<Role>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.add),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ROLE, id: 'LIST' }],
    }),
    editRole: builder.mutation<RoleResponse, { id: string; body: Partial<Role> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.ROLE, id },
        { type: TAG_TYPES.ROLE, id: 'LIST' },
      ],
    }),
    deleteRole: builder.mutation<RoleResponse, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.ROLE, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRoleListQuery,
  useGetRoleByIdQuery,
  useAddRoleMutation,
  useEditRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
