import { useEffect, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from './use-auth'

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
}

/**
 * Hook to guard routes based on authentication status.
 *
 * @param options - Configuration options
 * @param options.redirectTo - Where to redirect if auth check fails (default: '/auth/login')
 * @param options.requireAuth - Whether authentication is required (default: true)
 * @returns Authentication status
 */
export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = '/auth/login', requireAuth = true } = options
  const router = useRouter()
  const { isAuthenticated, isReady, isLoading, user } = useAuth()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Get current path to avoid redirecting from auth pages
    const currentPath = router.state.location.pathname

    // Skip auth pages
    if (currentPath.startsWith('/auth/')) {
      return
    }

    // Wait for auth initialization to complete
    if (!isReady) {
      return
    }

    // Prevent duplicate redirects
    if (hasRedirected.current) {
      return
    }

    // If auth is required and user is not authenticated, redirect to login
    if (requireAuth && !isAuthenticated) {
      hasRedirected.current = true
      router.navigate({ to: redirectTo })
    }
  }, [isAuthenticated, isReady, requireAuth, redirectTo, router])

  // Reset redirect flag when auth state changes
  useEffect(() => {
    hasRedirected.current = false
  }, [isAuthenticated])

  return {
    isAuthenticated,
    isReady,
    isLoading,
    user,
    isChecking: !isReady || isLoading,
  }
}
