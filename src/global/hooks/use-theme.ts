import { useContext } from 'react'
import { ThemeContext, type ThemeContextType } from '@/global/context/theme-context'

/**
 * Hook to access the ThemeContext provided by ThemeProvider.
 * Returns the current theme, the setTheme function and the list of available themes.
 *
 * @warning useTheme hook must be used within ThemeProvider.
 */
export function useTheme(): ThemeContextType {
  const context: ThemeContextType = useContext(ThemeContext)

  // ThemeContext has initial value, so that it need not be checked for undefined.
  return context
}
