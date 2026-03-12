import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useToken } from '@/hooks/useToken';
import { useLoginMutation } from '../api/authApi';
import { storage } from '@/utils/storage';

const REMEMBERED_USER_KEY = 'rememberedUser';

export interface RememberedUser {
  username: string;
  fullname?: string;
  avatar?: string;
  isSuperAdmin?: boolean;
  roleName?: string;
}

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const { goToDashboard } = useAppNavigate();
  const { notification } = useAppNotify();
  const { setToken } = useToken();

  const [login, { isLoading: loading }] = useLoginMutation();

  const [rememberedUser, setRememberedUser] = useState<RememberedUser | null>(() => {
    return storage.localStorageGet(REMEMBERED_USER_KEY);
  });

  const [isRememberedMode, setIsRememberedMode] = useState<boolean>(!!rememberedUser);
  const [rememberAccount, setRememberAccount] = useState<boolean>(!!rememberedUser);

  const handleLogin = async (values: any) => {
    try {
      const loginData =
        isRememberedMode && rememberedUser
          ? { username: rememberedUser.username, password: values.password, captchaToken: 'wkey' }
          : { ...values, captchaToken: 'wkey' };

      const response = await login(loginData).unwrap();
      const user = response.result.user;

      if (rememberAccount) {
        const userToRemember: RememberedUser = {
          username: user?.userName || loginData.username,
          fullname: user?.fullname,
          avatar: user?.avatar,
          isSuperAdmin: user?.isSuperAdmin,
          roleName: user?.role?.name,
        };
        storage.localStorageSet(REMEMBERED_USER_KEY, userToRemember);
        setRememberedUser(userToRemember);
      } else {
        storage.localStorageRemove(REMEMBERED_USER_KEY);
        setRememberedUser(null);
      }

      setToken(response.result.access_token);
      goToDashboard();
    } catch (error: any) {
      notification.error({
        title: t('errors.loginFailed'),
        description: error.message || t('errors.checkCredentials'),
      });
    }
  };

  const switchToFullLogin = () => {
    setIsRememberedMode(false);
    setRememberAccount(false);
  };

  const switchToRememberedLogin = () => {
    if (rememberedUser) {
      setIsRememberedMode(true);
      setRememberAccount(true);
    }
  };

  const clearRememberedUser = () => {
    storage.localStorageRemove(REMEMBERED_USER_KEY);
    setRememberedUser(null);
    setIsRememberedMode(false);
    setRememberAccount(false);
  };

  return {
    t,
    loading,
    handleLogin,
    rememberedUser,
    isRememberedMode,
    rememberAccount,
    setRememberAccount,
    switchToFullLogin,
    switchToRememberedLogin,
    clearRememberedUser,
  };
};
