import { useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { fonts } from '@/config/fonts'
import type { Font } from './contexts/font-context'
import {
  FontContext,
  FONT_COOKIE_NAME,
  FONT_COOKIE_MAX_AGE
} from './contexts/font-context'

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<Font>(() => {
    const fontCookie = getCookie(FONT_COOKIE_NAME)
    if (fontCookie && fonts.includes(fontCookie as Font)) {
      return fontCookie as Font
    }
    return fonts[0]
  })

  const setFont = (font: Font) => {
    if (!fonts.includes(font)) return
    setFontState(font)
    setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
    // Update the font class on the html element
    document.documentElement.classList.remove(...fonts.map((f: string) => `font-${f}`))
    document.documentElement.classList.add(`font-${font}`)
  }

  const resetFont = () => {
    setFontState(fonts[0])
    removeCookie(FONT_COOKIE_NAME)
    // Update the font class on the html element
    document.documentElement.classList.remove(...fonts.map((f: string) => `font-${f}`))
    document.documentElement.classList.add(`font-${fonts[0]}`)
  }

  // Set the font on initial render
  useState(() => {
    document.documentElement.classList.add(`font-${font}`)
  })

  return (
    <FontContext.Provider value={{ font, setFont, resetFont }}>
      {children}
    </FontContext.Provider>
  )
}

