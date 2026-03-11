
import logoPrimary from '@/assets/images/logo.png';
import logoMiniPrimary from '@/assets/images/logo-mini.png';
import productPlaceholder from '@/assets/images/product-placeholder.png';

export const APP_ASSETS = {
  BANNER_LOGIN: '/images/background.png',

  LOGO_PRIMARY: logoPrimary,
  LOGO_MINI_PRIMARY: logoMiniPrimary,
  FAVICON: '/favicon.ico',

  IMAGE_FALLBACK_DEFAULT: productPlaceholder,
  PRODUCT_PLACEHOLDER: productPlaceholder,
} as const;
