import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
// Dynamically import all translation files from modules and global folder
const modulesLocales = import.meta.glob('../modules/*/translation/*.ts', { eager: true });
const globalLocales = import.meta.glob('./translation/*.ts', { eager: true });

const resources: any = { en: {}, vi: {} };

Object.entries(globalLocales).forEach(([path, content]: [string, any]) => {
  const lang = path.split('/').pop()?.replace('.ts', '');
  if (lang && resources[lang]) {
    resources[lang].translation = content.default;
  }
});

Object.entries(modulesLocales).forEach(([path, content]: [string, any]) => {
  const parts = path.split('/');
  const moduleName = parts[parts.length - 3];
  const lang = parts[parts.length - 1].replace('.ts', '');

  if (lang && resources[lang]) {
    resources[lang][moduleName] = content.default;
  }
});

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
