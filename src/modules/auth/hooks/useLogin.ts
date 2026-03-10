import { useTranslation } from 'react-i18next';
import { useAppNotify } from '@/hooks/useAppNotify';
import { useAppNavigate } from '@/hooks/useAppNavigate';
import { useToken } from '@/hooks/useToken';
import { useLoginMutation } from '../api/authApi';

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const { goToDashboard } = useAppNavigate();
  const { notification } = useAppNotify();
  const { setToken } = useToken();

  const [login, { isLoading: loading }] = useLoginMutation();

  const handleLogin = async (values: any) => {
    try {

      const response = await login({ ...values, captchaToken: 'wkey' }).unwrap();

      setToken(response.result.access_token);


      goToDashboard();
    } catch (error: any) {
      notification.error({
        message: t('errors.loginFailed'),
        description: error.message || t('errors.checkCredentials'),
      });
    }
  };

  return {
    t,
    loading,
    handleLogin,
  };
};
