import { useTranslation } from 'react-i18next'

/**
 * Hook to use questions translations
 * No loading needed - questions namespace is preloaded in i18n config
 */
export const useQuestionsTranslation = () => {
  const { t, i18n } = useTranslation('questions')

  return { t, i18n }
}
