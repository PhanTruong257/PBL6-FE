import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'

// Import common translations
import commonEN from './locales/en/common.json'
import commonVI from './locales/vi/common.json'

// Import Zod translations (from our custom locales)
import zodEN from './locales/en/zod.json'
import zodVI from './locales/vi/zod.json'

// Import auth translations (preload)
import authEN from '../../features/auth/locales/en/auth.json'
import authVI from '../../features/auth/locales/vi/auth.json'

// Import questions translations (preload)
import questionsEN from '../../features/questions/locales/en/questions.json'
import questionsVI from '../../features/questions/locales/vi/questions.json'

// Create resources object with preloaded auth namespace
const resources = {
  en: {
    common: commonEN,
    zod: zodEN,
    auth: authEN, // Preload auth
    questions: questionsEN, // Preload questions
  },
  vi: {
    common: commonVI,
    zod: zodVI,
    auth: authVI, // Preload auth
    questions: questionsVI, // Preload questions
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

// Set Zod error map to use i18n translations
z.setErrorMap(makeZodI18nMap({ ns: 'zod' }))

export default i18n

// Helper function to load namespace dynamically
export const loadNamespace = (ns: string, lng: string, translations: any) => {
  if (!i18n.hasResourceBundle(lng, ns)) {
    i18n.addResourceBundle(lng, ns, translations, true, true)
  }
}
