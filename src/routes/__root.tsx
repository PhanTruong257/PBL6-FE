import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/context/theme-provider'
import { DirectionProvider } from '@/context/direction-provider'
import { FontProvider } from '@/context/font-provider'
import { SearchProvider } from '@/context/search-provider'
import { LayoutProvider } from '@/context/layout-provider'

// Define the router context type
export interface MyRouterContext {
  queryClient: QueryClient
}

// Create the root route
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="lms-ui-theme">
      <DirectionProvider>
        <FontProvider>
          <SearchProvider>
            <LayoutProvider>
              <div className="relative min-h-screen">
                <Outlet />
                <Toaster closeButton position="bottom-right" />
                {process.env.NODE_ENV === 'development' && (
                  <TanStackRouterDevtools position="bottom-left" />
                )}
              </div>
            </LayoutProvider>
          </SearchProvider>
        </FontProvider>
      </DirectionProvider>
    </ThemeProvider>
  )
}