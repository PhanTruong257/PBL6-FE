import { useContext } from 'react'
import { FontContext } from '@/context/contexts/font-context'

export function useFont() {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}