import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { ApiResponse } from '@/types/api';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, PARAMS_KEY, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { User, PaginatedUserResult, UserListParams } from '../data/user.types';

const MODULE_NAME = 'user';

const endpoints: Record<
  'list' | 'listPagination' | 'getById' | 'add' | 'edit' | 'delete' | 'batchDelete',
  Endpoint
> = {
  list: {
    endpoint: `/${MODULE_NAME}/list`,
  },
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
  getById: {
    endpoint: `/${MODULE_NAME}/get/${PARAMS_KEY}`,
  },
  add: {
    endpoint: `/${MODULE_NAME}/create`,
  },
  edit: {
    endpoint: `/${MODULE_NAME}/edit/${PARAMS_KEY}`,
  },
  delete: {
    endpoint: `/${MODULE_NAME}/delete/${PARAMS_KEY}`,
  },
  batchDelete: {
    endpoint: `/${MODULE_NAME}/batchDelete`,
  },
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query<ApiResponse<PaginatedUserResult>, UserListParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.USER),
    }),
    getUserListAll: builder.query<ApiResponse<User[]>, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.list),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.USER),
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.USER, id }],
    }),
    addUser: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.add),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.USER, id: 'LIST' }],
    }),
    editUser: builder.mutation<ApiResponse<User>, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.USER, id },
        { type: TAG_TYPES.USER, id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<ApiResponse<any>, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.USER, id: 'LIST' }],
    }),
    batchDeleteUsers: builder.mutation<ApiResponse<any>, string[]>({
      query: (userIds) => ({
        url: generateEndpointVersionning(endpoints.batchDelete),
        method: HTTP_METHOD.DELETE,
        data: { userIds },
      }),
      invalidatesTags: [{ type: TAG_TYPES.USER, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserListQuery,
  useGetUserListAllQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useBatchDeleteUsersMutation,
} = userApi;
