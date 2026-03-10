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
}

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const { goToDashboard } = useAppNavigate();
  const { notification } = useAppNotify();
  const { setToken } = useToken();

  const [login, { isLoading: loading }] = useLoginMutation();

  // Lấy tài khoản đã nhớ từ localStorage
  const [rememberedUser, setRememberedUser] = useState<RememberedUser | null>(() => {
    return storage.localStorageGet(REMEMBERED_USER_KEY);
  });

  // Chế độ hiển thị: true = chỉ hiện password, false = hiện đầy đủ
  const [isRememberedMode, setIsRememberedMode] = useState<boolean>(!!rememberedUser);
  const [rememberAccount, setRememberAccount] = useState<boolean>(!!rememberedUser);

  const handleLogin = async (values: any) => {
    try {
      // Nếu đang ở chế độ nhớ tài khoản, dùng username đã lưu
      const loginData = isRememberedMode && rememberedUser
        ? { username: rememberedUser.username, password: values.password, captchaToken: 'wkey' }
        : { ...values, captchaToken: 'wkey' };

      const response = await login(loginData).unwrap();

      // Lưu hoặc xóa tài khoản nhớ
      if (rememberAccount) {
        const userToRemember: RememberedUser = {
          username: loginData.username,
          fullname: response.result.user?.fullname,
          avatar: response.result.user?.avatar,
        };
        storage.localStorageSet(REMEMBERED_USER_KEY, userToRemember);
      } else {
        storage.localStorageRemove(REMEMBERED_USER_KEY);
      }

      setToken(response.result.access_token);
      goToDashboard();
    } catch (error: any) {
      notification.error({
        message: t('errors.loginFailed'),
        description: error.message || t('errors.checkCredentials'),
      });
    }
  };

  // Chuyển sang chế độ nhập tài khoản khác
  const switchToFullLogin = () => {
    setIsRememberedMode(false);
    setRememberAccount(false);
  };

  // Quay lại chế độ nhớ tài khoản
  const switchToRememberedLogin = () => {
    if (rememberedUser) {
      setIsRememberedMode(true);
      setRememberAccount(true);
    }
  };

  // Xóa tài khoản đã nhớ
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
