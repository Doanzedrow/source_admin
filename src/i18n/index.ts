import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEn from './translation/en';
import translationVi from './translation/vi';

// Modules Locales
import productEn from '@/modules/product/translation/en';
import productVi from '@/modules/product/translation/vi';
import authEn from '@/modules/auth/translation/en';
import authVi from '@/modules/auth/translation/vi';
import dashboardEn from '@/modules/dashboard/translation/en';
import dashboardVi from '@/modules/dashboard/translation/vi';

const resources = {
  en: { 
    translation: translationEn,
    product: productEn,
    auth: authEn,
    dashboard: dashboardEn
  },
  vi: { 
    translation: translationVi,
    product: productVi,
    auth: authVi,
    dashboard: dashboardVi
  }
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi', // default Tiếng Việt
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react
    },
  });

export default i18n;
