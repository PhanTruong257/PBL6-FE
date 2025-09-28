import { createContext } from 'react'
import { fonts } from '@/config/fonts'

export type Font = (typeof fonts)[number]

export const FONT_COOKIE_NAME = 'font'
export const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

export const FontContext = createContext<FontContextType | null>(null)