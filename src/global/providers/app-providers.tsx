import { StrictMode, type ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import * as TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'

/**
 * Root providers wrapper
 * Combines all application-wide providers in the correct order
 */
interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StrictMode>
      <TanStackQueryProvider.Provider
        {...TanStackQueryProvider.getContext()}
      >
        <ThemeProvider defaultTheme="light" storageKey="pbl6-ui-theme">
          {children}
        </ThemeProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>
  )
}
