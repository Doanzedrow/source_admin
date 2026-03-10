import { Form } from 'antd';
import { AppButton } from '@/components/common/AppButton';
import { AppInput, AppPassword } from '@/components/common/AppInput';
import CachedImage from '@/components/common/CachedImage/CachedImage';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { SEO } from '@/components/common/SEO/SEO';
import { useLogin } from '../hooks/useLogin';
import { APP_ASSETS } from '@/config/assets';
import { APP_NAME } from '@/config/constants';
import '../styles/login.less';

const Login = () => {

  const { t, loading, handleLogin } = useLogin();

  return (
    <div className="login-page-container">
      <SEO title={t('seoTitle')} description={t('seoDescription')} />
      <div className="login-banner">
        <CachedImage
          src={APP_ASSETS.BANNER_LOGIN}
          alt={t('form.bannerAlt')}
          className="banner-image"
        />
      </div>

      <div className="login-form-wrapper">
        <div className="language-toggle">
           <LanguageSwitcher />
        </div>
        <div className="login-form-box">
          <div className="login-header">
            <CachedImage 
              src={APP_ASSETS.LOGO_PRIMARY}
              alt={t('form.logoAlt')}
              className="login-logo"
              width={180}
              height="auto"
            />
            <h2>{t('title', { appName: APP_NAME })}</h2>
            <p>{t('welcome')}</p>
          </div>

          <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
            <AppInput
              id="username"
              name="username"
              label={t('form.username')}
              placeholder={t('form.usernamePlaceholder')}
              rules={[{ required: true, message: t('form.usernameFeedback') }]}

              regex={/^[a-zA-Z0-9_]+$/i}
              regexMessage={t('errors.invalidUsername')}
            />

            <AppPassword
              id="password"
              name="password"
              label={t('form.password')}
              placeholder={t('form.passwordPlaceholder')}
              rules={[{ required: true, message: t('form.passwordFeedback') }]}

              regex={/.{6,}/}
              regexMessage={t('errors.invalidPassword')}
            />

            <Form.Item className="login-submit-wrapper">
              <AppButton
                id="login-submit"
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
