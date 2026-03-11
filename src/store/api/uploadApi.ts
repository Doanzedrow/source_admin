import { baseApi } from '@/store/baseApi';
import { HTTP_METHOD } from '@/config/constants';
import type { Endpoint } from '@/utils/api';
import { generateEndpointVersionning } from '@/utils/api';
import type { ThumbnailResponse } from '@/types';
import { API_URL } from '@/config/constants';

const endpoints: Record<'upload', Endpoint> = {
  upload: {
    endpoint: '/media',
  },
};

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<{ status: string; result: ThumbnailResponse }, FormData>({
      query: (formData) => ({
        url: generateEndpointVersionning(endpoints.upload),
        method: HTTP_METHOD.POST,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadMediaMutation } = uploadApi;

export const getFullImageUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const cleanBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};
