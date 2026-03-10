import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning } from '@/utils/api';

const MODULE_NAME = 'auth';

const endpoints: Record<'login' | 'validateToken', Endpoint> = {
  login: {
    endpoint: `/${MODULE_NAME}/login`,
  },
  validateToken: {
    endpoint: `/${MODULE_NAME}/auth-token`,
  },
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, any>({
      query: (account) => ({
        url: generateEndpointVersionning(endpoints.login),
        method: HTTP_METHOD.POST,
        data: account,
      }),
    }),
    validateToken: builder.query<any, void>({
      query: () => ({
        url: generateEndpointVersionning(endpoints.validateToken),
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useValidateTokenQuery,
  useLazyValidateTokenQuery,
} = authApi;
