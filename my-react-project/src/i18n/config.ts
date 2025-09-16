import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/translation.json';
import arTranslations from './locales/ar/translation.json';

console.log('i18n config loaded, initializing...');

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
};

try {
  i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
      resources,
      fallbackLng: 'en',
      debug: true, // Enable debug temporarily
      
      interpolation: {
        escapeValue: false // React already safeguards from XSS
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
      
      react: {
        useSuspense: false // Disable suspense for better error handling
      }
    });
  console.log('i18n initialized successfully');
} catch (error) {
  console.error('Error initializing i18n:', error);
}

// Function to change language and update HTML dir attribute
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  
  // Store language preference
  localStorage.setItem('i18nextLng', lng);
};

// Initialize document direction based on current language
try {
  const currentLang = i18n.language || 'en';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  console.log('Document language set to:', currentLang);
} catch (error) {
  console.error('Error setting document language:', error);
}

export default i18n;
