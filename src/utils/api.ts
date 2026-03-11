import { PREFIX_VERSION, DEFAULT_VERSION } from '@/config/constants';

export interface Endpoint {
  endpoint: string;
  version?: string;
  isCustomUrl?: boolean;
}

/**
 * Generate a versioned endpoint string.
 */
export const generateEndpointVersionning = (endpoint: Endpoint) => {
  if (endpoint.isCustomUrl) return endpoint.endpoint;
  const version = endpoint.version || DEFAULT_VERSION;
  return `/${PREFIX_VERSION}${version}${endpoint.endpoint}`;
};

export const PARAMS_KEY = '${PARAMS_KEY}';

/**
 * Helper to provide tags for a list response
 */
export function providesList<T extends { _id: string | number }, TagType extends string>(
  resultsWithIds: { result?: { data: T[] } | T[] } | undefined,
  tagType: TagType
) {
  const data = Array.isArray(resultsWithIds?.result) 
    ? resultsWithIds?.result 
    : resultsWithIds?.result?.data;

  if (data) {
    return [
      ...(data as T[]).map(({ _id }) => ({ type: tagType, id: _id })),
      { type: tagType, id: 'LIST' },
    ];
  }
  return [{ type: tagType, id: 'LIST' }];
}
