import { StrictMode, type ReactNode } from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { GlobalSocketProvider } from './socket-provider'
import { GlobalInitializer } from './global-initializer'
import * as TanStackQueryProvider from '@/integrations/tanstack-query/root-provider'

/**
 * Props for the AppProviders component.
 */
export interface AppProvidersProps {
  children: ReactNode
}

/**
 * Root providers wrapper
 * Combines all application-wide providers in the correct order
 *
 * Provider hierarchy (order matters!):
 * 1. StrictMode - React development mode checks
 * 2. TanStackQueryProvider - Query cache must be available early
 * 3. GlobalSocketProvider - WebSocket connection management
 * 4. ThemeProvider - UI theming
 * 5. GlobalInitializer - Auto-initializes auth & notifications (uses useAuth hook internally)
 * 6. RouterProvider - Routing (provided via children from main.tsx)
 *
 * Auth is managed via Recoil state (authState) + useAuth hook.
 * No separate AuthProvider needed - useAuth auto-initializes on first use.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProvider.getContext()}>
        <GlobalSocketProvider>
          <ThemeProvider defaultTheme="light" storageKey="pbl6-ui-theme">
            <GlobalInitializer>
              {children}
            </GlobalInitializer>
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </GlobalSocketProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>
  )
}
