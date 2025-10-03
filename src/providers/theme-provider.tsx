import { useEffect, useState } from 'react'
import {
  ThemeContext,
  AVAILABLE_THEMES,
  type Theme,
} from '@/context/theme-context.tsx'

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'pbl6-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme: string | null = localStorage.getItem(storageKey)
    return storedTheme ? (storedTheme as Theme) : defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove all theme classes
    AVAILABLE_THEMES.forEach((t) => root.classList.remove(t.name))

    // Add current theme class
    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    themes: AVAILABLE_THEMES,
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
