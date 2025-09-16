import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translations
import enCommon from '../locales/en/common.json';
import enRooms from '../locales/en/rooms.json';

// Import Arabic translations
import arCommon from '../locales/ar/common.json';
import arRooms from '../locales/ar/rooms.json';

const resources = {
  en: {
    translation: {
      ...enCommon.common,
      ...enRooms.rooms,
      common: enCommon.common,
      rooms: enRooms.rooms
    }
  },
  ar: {
    translation: {
      ...arCommon.common,
      ...arRooms.rooms,
      common: arCommon.common,
      rooms: arRooms.rooms
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie']
    }
  });

// Set the HTML dir attribute when language changes
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;
