import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import { generateEndpointVersionning, PARAMS_KEY, providesList } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { Shift, ShiftListResponse, ShiftResponse, ShiftListParams } from '../data/shift.types';
import type { Endpoint } from '@/utils/api';
import type { ApiResponse } from '@/types/api';

const MODULE_NAME = 'shift';

const endpoints: Record<
  'index' | 'list' | 'getById' | 'add' | 'edit' | 'delete' | 'batchDelete' | 'switchStatus',
  Endpoint
> = {
  index: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
  list: {
    endpoint: `/${MODULE_NAME}/list`,
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
  switchStatus: {
    endpoint: `/${MODULE_NAME}/switchStatus/${PARAMS_KEY}`,
  },
};

export const shiftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShiftList: builder.query<ShiftListResponse, ShiftListParams>({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.index),
        method: HTTP_METHOD.GET,
        params,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.SHIFT),
    }),
    getShiftListAll: builder.query<ApiResponse<Shift[]>, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.list),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.SHIFT),
    }),
    getShiftById: builder.query<ShiftResponse, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.getById).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (_result, _error, id) => [{ type: TAG_TYPES.SHIFT, id }],
    }),
    addShift: builder.mutation<ShiftResponse, Partial<Shift>>({
      query: (body) => ({
        url: generateEndpointVersionning(endpoints.add),
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: [{ type: TAG_TYPES.SHIFT, id: 'LIST' }],
    }),
    editShift: builder.mutation<ShiftResponse, { id: string; body: Partial<Shift> }>({
      query: ({ id, body }) => ({
        url: generateEndpointVersionning(endpoints.edit).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.SHIFT, id },
        { type: TAG_TYPES.SHIFT, id: 'LIST' },
      ],
    }),
    deleteShift: builder.mutation<ShiftResponse, string>({
      query: (id) => ({
        url: generateEndpointVersionning(endpoints.delete).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: [{ type: TAG_TYPES.SHIFT, id: 'LIST' }],
    }),
    batchDeleteShifts: builder.mutation<ShiftResponse, string[]>({
      query: (ids) => ({
        url: generateEndpointVersionning(endpoints.batchDelete),
        method: HTTP_METHOD.DELETE,
        data: { ids },
      }),
      invalidatesTags: [{ type: TAG_TYPES.SHIFT, id: 'LIST' }],
    }),
    switchShiftStatus: builder.mutation<ShiftResponse, { id: string; status: number }>({
      query: ({ id, status }) => ({
        url: generateEndpointVersionning(endpoints.switchStatus).replace(PARAMS_KEY, id),
        method: HTTP_METHOD.PUT,
        data: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: TAG_TYPES.SHIFT, id },
        { type: TAG_TYPES.SHIFT, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetShiftListQuery,
  useGetShiftListAllQuery,
  useGetShiftByIdQuery,
  useAddShiftMutation,
  useEditShiftMutation,
  useDeleteShiftMutation,
  useBatchDeleteShiftsMutation,
  useSwitchShiftStatusMutation,
} = shiftApi;
