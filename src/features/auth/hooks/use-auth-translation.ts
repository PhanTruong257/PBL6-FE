import { useTranslation } from 'react-i18next'

/**
 * Hook to use auth translations
 * No loading needed - auth namespace is preloaded in i18n config
 */
export function useAuthTranslation() {
  const { t, i18n } = useTranslation('auth')

  return { t, i18n }
}
