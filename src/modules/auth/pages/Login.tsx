import { Form, Checkbox, Avatar, Flex, Tag } from 'antd';
import { UserOutlined, CrownOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/common/AppButton';
import { AppInput, AppPassword } from '@/components/common/AppInput';
import CachedImage from '@/components/common/CachedImage/CachedImage';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { SEO } from '@/components/common/SEO/SEO';
import { useLogin } from '../hooks/useLogin';
import { REGEX } from '@/utils/regex';
import { APP_ASSETS } from '@/config/assets';
import { APP_NAME } from '@/config/constants';
import '../styles/login.less';

const Login = () => {
  const {
    t,
    loading,
    handleLogin,
    rememberedUser,
    isRememberedMode,
    rememberAccount,
    setRememberAccount,
    switchToFullLogin,
    switchToRememberedLogin,
  } = useLogin();

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
            <p>{isRememberedMode ? t('welcomeBack') : t('welcome')}</p>
          </div>

          {isRememberedMode && rememberedUser ? (
            <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
              <div className="remembered-user-section">
                <Avatar
                  size={56}
                  icon={<UserOutlined />}
                  className="remembered-avatar"
                />
                <div className="remembered-info">
                  <Flex align="center" gap={4}>
                    <span className="remembered-name">
                      {rememberedUser.fullname || rememberedUser.username}
                    </span>
                    {rememberedUser.isSuperAdmin ? (
                      <Tag 
                        color="gold" 
                        icon={<CrownOutlined />} 
                        style={{ margin: 0, borderRadius: '4px', fontSize: '10px' }}
                      >
                        {t('form.superAdmin')}
                      </Tag>
                    ) : (
                      rememberedUser.roleName && (
                        <Tag 
                          color="blue" 
                          style={{ margin: 0, borderRadius: '4px', fontSize: '10px' }}
                        >
                          {rememberedUser.roleName}
                        </Tag>
                      )
                    )}
                  </Flex>
                  <span className="remembered-username">@{rememberedUser.username}</span>
                </div>
              </div>

              <AppPassword
                id="password"
                name="password"
                label={t('form.password')}
                placeholder={t('form.passwordPlaceholder')}
                rules={[{ required: true, message: t('form.passwordFeedback') }]}
                regex={REGEX.PASSWORD}
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

              <div className="switch-account-link">
                <AppButton type="link" onClick={switchToFullLogin}>
                  {t('form.switchAccount')}
                </AppButton>
              </div>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
              <AppInput
                id="username"
                name="username"
                label={t('form.identity')}
                placeholder={t('form.identityPlaceholder')}
                rules={[
                  { required: true, message: t('form.usernameFeedback') },
                  {
                    validator: (_, value) => {
                      if (!value || REGEX.USERNAME.test(value) || REGEX.EMAIL.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('errors.invalidIdentity')));
                    },
                  },
                ]}
              />

              <AppPassword
                id="password"
                name="password"
                label={t('form.password')}
                placeholder={t('form.passwordPlaceholder')}
                rules={[{ required: true, message: t('form.passwordFeedback') }]}
                regex={REGEX.PASSWORD}
                regexMessage={t('errors.invalidPassword')}
              />

              <Form.Item className="remember-account-wrapper" style={{ marginBottom: 0 }}>
                <Checkbox
                  checked={rememberAccount}
                  onChange={(e) => setRememberAccount(e.target.checked)}
                >
                  {t('form.rememberAccount')}
                </Checkbox>
              </Form.Item>

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

              {/* Nếu có tài khoản đã nhớ, hiện link quay lại */}
              {rememberedUser && (
                <div className="switch-account-link">
                  <AppButton type="link" onClick={switchToRememberedLogin}>
                    {t('form.backToRemembered', { name: rememberedUser.fullname || rememberedUser.username })}
                  </AppButton>
                </div>
              )}
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
