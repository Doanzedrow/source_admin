import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useStorage } from '@/hooks/useStorage';

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const { goToDashboard } = useAppNavigate();
  const { message: antMessage, notification } = useAppNotify();
  const { setToken } = useStorage();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (_values: any) => {
    setLoading(true);


    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setToken('mock-token');

      antMessage.success({
        content: t('welcome'),
        duration: 3,
      });

      goToDashboard();
    } catch (error) {
      notification.error({
        message: t('errors.loginFailed'),
        description: t('errors.checkCredentials'),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    t,
    loading,
    handleLogin,
  };
};
