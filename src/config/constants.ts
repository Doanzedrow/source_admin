// ==========================================
// ENVIRONMENT VARIABLES & API CONFIGS
// ==========================================
export const VITE_ENV = import.meta.env;
export const ENV = import.meta.env.MODE;
export const isDev = ENV === 'development';
export const BASE_PATH = import.meta.env.BASE_URL as string;

export const API_URL = import.meta.env.VITE_API_URL as string;
export const API_URL_SOCKET = import.meta.env.VITE_API_URL_SOCKET as string;

// ==========================================
// API VERSIONING
// ==========================================
export const PREFIX_VERSION = 'v';
export const DEFAULT_VERSION = '1.0';

// ==========================================
// APP CONSTANTS & THEMES
// ==========================================
export const APP_COLOR_PRIMARY = '#d3929a';
export const APP_NAME = 'SPA Thanh Xuân';

// ==========================================
// I18N CONFIGURATION (SUPPORTED LANGUAGES)
// ==========================================
export const SUPPORTED_LANGUAGES = [
  { code: 'vi', label: 'Tiếng Việt', flag: '/images/flag-vi.png' },
  { code: 'en', label: 'English', flag: '/images/flag-en.png' },
];
