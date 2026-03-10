/**
 * Generic API Response structures.
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string | number;
  params?: {
    isAuthenticated: boolean;
    isUnauthenticated: boolean;
    url: string;
    method: string;
    routes: any;
    payload: any;
  };
  result: T;
  error?: string;
  debug?: string;
}

export interface ApiError {
  status: number;
  message: string;
  debug?: string;
}
