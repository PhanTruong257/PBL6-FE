import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth'

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
}

/**
 * Hook to guard routes based on authentication status
 * @param options - Configuration options
 * @param options.redirectTo - Where to redirect if auth check fails (default: '/auth/login')
 * @param options.requireAuth - Whether authentication is required (default: true)
 * @returns Authentication status
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/auth/login', requireAuth = true } = options
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useIsAuthenticated()

  useEffect(() => {
    // Get current path to avoid redirecting from auth pages
    const currentPath = router.state.location.pathname

    // Don't redirect if already on auth pages
    if (currentPath.startsWith('/auth/')) {
      console.log('🚫 On auth page, skipping redirect');
      return
    }

    // Add small delay to prevent immediate redirect on login failure
    const timeoutId = setTimeout(() => {

      // If auth is required and user is not authenticated, redirect to login
      if (requireAuth && !isAuthenticated) {
        console.log('🚪 Redirecting to:', redirectTo);
        router.navigate({ to: redirectTo })
      }

      // If auth is NOT required (e.g., guest routes) and user IS authenticated, redirect to home
      if (!requireAuth && isAuthenticated && user) {
      }
    }, 200) // 200ms delay

    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, user])

  return {
    isAuthenticated,
    isLoading,
    user,
    isChecking: isLoading,
  }
}
