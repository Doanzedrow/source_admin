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
