import { storage } from './storage';

/**
 * Token and Session Management Utilities
 */
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'loggedUser';

export const tokenUtil = {
  setToken: (token: string) => {
    storage.localStorageSet(TOKEN_KEY, token);
    storage.setCookie(TOKEN_KEY, token);
  },

  getToken: () => {
    return storage.localStorageGet(TOKEN_KEY) || storage.getCookie(TOKEN_KEY);
  },

  removeToken: () => {
    storage.localStorageRemove(TOKEN_KEY);
    storage.removeCookie(TOKEN_KEY);
  },

  setLoggedUser: (user: any) => {
    storage.localStorageSet(USER_KEY, user);
  },

  getLoggedUser: () => {
    return storage.localStorageGet(USER_KEY);
  },

  removeLoggedUser: () => {
    storage.localStorageRemove(USER_KEY);
  }
};
