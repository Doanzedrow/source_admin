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
