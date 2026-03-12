import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning, providesList, cleanParams } from '@/utils/api';
import { TAG_TYPES } from '@/store/tags';
import type { BranchListResponse, BranchPaginationResponse } from '../data/branch.types';

const MODULE_NAME = 'branch';

const endpoints: Record<'list' | 'listPagination', Endpoint> = {
  list: {
    endpoint: `/${MODULE_NAME}/list`,
  },
  listPagination: {
    endpoint: `/${MODULE_NAME}/list-pagination`,
  },
};

export const branchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranchList: builder.query<BranchListResponse, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.list),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.BRANCH),
    }),
    getBranchListPagination: builder.query<
      BranchPaginationResponse, 
      { page?: number; page_size?: number; keyword?: string; status?: number }
    >({
      query: (params) => ({
        url: generateEndpointVersionning(endpoints.listPagination),
        method: HTTP_METHOD.GET,
        params: cleanParams(params),
      }),
      providesTags: (result) => providesList(result, TAG_TYPES.BRANCH),
    }),
  }),
  overrideExisting: false,
});

export const { 
  useGetBranchListQuery, 
  useGetBranchListPaginationQuery 
} = branchApi;
