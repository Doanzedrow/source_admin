import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useToken } from '@/hooks/useToken';
import { useLoginMutation } from '../api/authApi';

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const { goToDashboard } = useAppNavigate();
  const { message: antMessage, notification } = useAppNotify();
  const { setToken } = useToken();
  
  // RTK Query: useLoginMutation provides the trigger function and state
  const [login, { isLoading: loading }] = useLoginMutation();

  const handleLogin = async (values: any) => {
    try {
      // RTK Query: Call actual API login and unwrap result
      const result = await login(values).unwrap();
      
      // Store token from API response
      setToken(result?.accessToken || 'mock-token');

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
    }
  };

  return {
    t,
    loading,
    handleLogin,
  };
};
