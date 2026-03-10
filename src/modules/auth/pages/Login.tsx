import { useState } from 'react';
import { Button, Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppInput, AppPassword } from '@/components/common/AppInput';
import CachedImage from '@/components/common/CachedImage/CachedImage';
import '../styles/login.less';

const Login = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      console.log('Login credentials:', values);
      localStorage.setItem('accessToken', 'mock-token');
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="login-page-container">
      {/* 1. SECTION BANNER (Only visible on Desktop) */}
      <div className="login-banner">
        {/* You can replace this src with your real banner image /images/background.png */}
        <CachedImage 
          src="/images/background.png" 
          alt="Login Banner" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <h1>SPA Thanh Xuân</h1>
          <p>Hệ thống quản trị và chăm sóc dịch vụ thông minh</p>
        </div>
      </div>

      {/* 2. SECTION FORM */}
      <div className="login-form-wrapper">
        <div className="login-form-box">
          
          <div className="login-header">
            <h2>{t('title')}</h2>
            <p>{t('welcome')}</p>
          </div>

          <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
            {/* Sử dụng Component Input Chung của toàn hệ thống */}
            <AppInput
              name="email"
              label={t('form.email')}
              placeholder={t('form.emailPlaceholder')}
              rules={[{ required: true, message: t('form.emailFeedback') }]}
              // Regex Validate Email siêu chuẩn
              regex={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}
              regexMessage={t('errors.invalidEmail')}
            />

            <AppPassword
              name="password"
              label={t('form.password')}
              placeholder={t('form.passwordPlaceholder')}
              rules={[{ required: true, message: t('form.passwordFeedback') }]}
              // Regex: Mật khẩu ít nhất 6 ký tự
              regex={/.{6,}/}
              regexMessage={t('errors.invalidPassword')}
            />

            <Form.Item style={{ marginTop: 32 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block 
                loading={loading}
              >
                {t('form.submitBtn')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
