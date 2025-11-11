import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { loadNamespace } from '@/libs/i18n'
import questionsEN from '../locales/en/questions.json'
import questionsVI from '../locales/vi/questions.json'

export const useQuestionsTranslation = () => {
  const { t, i18n } = useTranslation('questions')

  useEffect(() => {
    // Load questions namespace
    loadNamespace('questions', 'en', questionsEN)
    loadNamespace('questions', 'vi', questionsVI)
  }, [])

  return { t, i18n }
}
