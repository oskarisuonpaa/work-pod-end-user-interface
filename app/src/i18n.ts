// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fi from './locales/fi.json';

// Define translation resources
const resources = {
  en: { translation: en },
  fi: { translation: fi }
};


i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

  const savedLanguage = localStorage.getItem('userLanguage');

if (savedLanguage) {
  i18n.changeLanguage(savedLanguage);
}


export default i18n;