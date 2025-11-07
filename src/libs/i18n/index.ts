import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import common translations
import commonEN from './locales/en/common.json'
import commonVI from './locales/vi/common.json'

// Create resources object
const resources = {
  en: {
    common: commonEN,
  },
  vi: {
    common: commonVI,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi', // Default to Vietnamese
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  })

export default i18n

// Helper function to load namespace dynamically
export const loadNamespace = (ns: string, lng: string, translations: any) => {
  if (!i18n.hasResourceBundle(lng, ns)) {
    i18n.addResourceBundle(lng, ns, translations, true, true)
  }
}
