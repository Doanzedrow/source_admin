import { tokenUtil } from '@/utils/token';

/**
 * Hook providing utility methods for authentication tokens and user session.
 */
export const useToken = () => {
  return {
    ...tokenUtil,
  };
};
