export const useStorage = () => {
  const localStorageSet = (key: string, value: any) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, stringValue);
    } catch {
      // Fail silently or handle quietly
    }
  };

  const localStorageGet = (key: string) => {
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
  };

  const localStorageRemove = (key: string) => {
    window.localStorage.removeItem(key);
  };

  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const getCookie = (name: string) => {
    return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=');
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, '');
  };

  const removeCookie = (name: string) => {
    setCookie(name, '', -1);
  };

  const setToken = (token: string) => {
    localStorageSet('accessToken', token);
    setCookie('accessToken', token);
  };

  const getToken = () => {
    return localStorageGet('accessToken') || getCookie('accessToken');
  };

  const removeToken = () => {
    localStorageRemove('accessToken');
    removeCookie('accessToken');
  };

  return {
    localStorageSet,
    localStorageGet,
    localStorageRemove,
    setCookie,
    getCookie,
    removeCookie,
    setToken,
    getToken,
    removeToken,
  };
};
