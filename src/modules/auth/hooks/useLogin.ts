import { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useLogin = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    setLoading(true);


    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login credentials:', values);

      localStorage.setItem('accessToken', 'mock-token');
      message.success(t('welcome', { defaultValue: 'Đăng nhập thành công!' }));


      navigate('/dashboard');
    } catch (error) {
      message.error(t('errors.loginFailed'));
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
