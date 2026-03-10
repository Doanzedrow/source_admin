import { Form } from 'antd';
import { AppButton } from '@/components/common/AppButton';
import { AppInput, AppPassword } from '@/components/common/AppInput';
import CachedImage from '@/components/common/CachedImage/CachedImage';
import { useLogin } from '../hooks/useLogin';
import { APP_ASSETS } from '@/config/assets';
import '../styles/login.less';

const Login = () => {

  const { t, loading, handleLogin } = useLogin();

  return (
    <div className="login-page-container">
      {/* 1. SECTION BANNER (Only visible on Desktop) */}
      <div className="login-banner">
        <CachedImage
          src={APP_ASSETS.BANNER_LOGIN}
          alt={t('form.bannerAlt')}
          className="banner-image"
        />
      </div>

      {/* 2. SECTION FORM */}
      <div className="login-form-wrapper">
        <div className="login-form-box">

          <div className="login-header">
            <CachedImage 
              src={APP_ASSETS.LOGO_PRIMARY}
              alt={t('form.logoAlt')}
              className="login-logo"
            />
            <h2>{t('title')}</h2>
            <p>{t('welcome')}</p>
          </div>

          <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
            {/* Sử dụng Component Input Chung của toàn hệ thống */}
            <AppInput
              name="email"
              label={t('form.email')}
              placeholder={t('form.emailPlaceholder')}
              rules={[{ required: true, message: t('form.emailFeedback') }]}

              regex={/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i}
              regexMessage={t('errors.invalidEmail')}
            />

            <AppPassword
              name="password"
              label={t('form.password')}
              placeholder={t('form.passwordPlaceholder')}
              rules={[{ required: true, message: t('form.passwordFeedback') }]}

              regex={/.{6,}/}
              regexMessage={t('errors.invalidPassword')}
            />

            <Form.Item className="login-submit-wrapper">
              <AppButton
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                {t('form.submitBtn')}
              </AppButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
