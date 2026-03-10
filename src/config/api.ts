import { API_URL, PREFIX_VERSION, DEFAULT_VERSION } from './constants';


export const getBaseApiUrl = (version = DEFAULT_VERSION) => {
  const cleanBaseUrl = API_URL.replace(/\/$/, "");
  return `${cleanBaseUrl}/${PREFIX_VERSION}${version}`;
};


