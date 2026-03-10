// ==========================================
// ENVIRONMENT VARIABLES & API CONFIGS
// ==========================================
export const API_URL = import.meta.env.VITE_API_URL as string || 'https://api.spa.test.zinisoft.net/api';
export const API_URL_SOCKET = import.meta.env.VITE_API_URL_SOCKET as string || 'https://api.spa.test.zinisoft.net';

// ==========================================
// APP CONSTANTS & THEMES
// ==========================================
// Bảng màu chuẩn của thương hiệu (Dùng để config Ant Design)
export const APP_COLOR_PRIMARY = '#d3929a';
