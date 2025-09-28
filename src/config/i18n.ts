import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enTranslations from '../locales/en.json'
import viTranslations from '../locales/vi.json'

const resources = {
  en: {
    translation: enTranslations,
  },
  vi: {
    translation: viTranslations,
  },
}

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: 'us' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'vn' },
]

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})

export default i18n