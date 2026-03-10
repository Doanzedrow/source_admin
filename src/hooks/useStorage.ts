import { storage } from '@/utils/storage';

/**
 * Hook providing utility methods for generic local storage and cookies.
 */
export const useStorage = () => {
  return {
    ...storage,
  };
};
