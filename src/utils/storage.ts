/**
 * Generic Storage Utilities (LocalStorage & Cookies)
 */
export const storage = {
  localStorageSet: (key: string, value: any) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, stringValue);
    } catch {
      // Quiet fail
    }
  },

  localStorageGet: (key: string) => {
    try {
      const value = window.localStorage.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch {
      return null;
    }
  },

  localStorageRemove: (key: string) => {
    window.localStorage.removeItem(key);
  },

  setCookie: (name: string, value: string, days: number = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  },

  getCookie: (name: string) => {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  },

  removeCookie: (name: string) => {
    storage.setCookie(name, '', -1);
  },
};
