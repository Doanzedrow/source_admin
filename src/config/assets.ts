
import logoPrimary from '@/assets/images/logo.png';

export const IMAGE_DIR = '/images';
export const ICON_DIR = '/icons';

export const APP_ASSETS = {
  BANNER_LOGIN: `${IMAGE_DIR}/background.png`,

  LOGO_PRIMARY: logoPrimary,
  FAVICON: '/favicon.ico',

  IMAGE_FALLBACK_DEFAULT: '/favicon.ico',
} as const;
