import { useEffect, useCallback, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { authState, isAuthenticatedSelector, isAuthReadySelector } from '@/global/recoil/auth/auth-state'
import { AuthService } from '@/features/auth'
import { cookieStorage } from '@/libs/utils'

/**
 * Main authentication hook
 *
 * Consolidates all auth functionality:
 * - Auto-initialization on mount
 * - User state management
 * - Login/logout operations
 * - Loading and error states
 *
 * This hook replaces:
 * - useAuthInitialization
 * - useIsAuthenticated
 * - useAuthReady
 * - useCurrentUser
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isAuthenticated, isReady, logout } = useAuth()
 *
 *   if (!isReady) {
 *     return <LoadingSpinner />
 *   }
 *
 *   return isAuthenticated ? (
 *     <div>Welcome {user.full_name}</div>
 *   ) : (
 *     <div>Please login</div>
 *   )
 * }
 * ```
 */
export function useAuth() {
  const [auth, setAuth] = useRecoilState(authState)
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector)
  const isReady = useRecoilValue(isAuthReadySelector)
  const hasInitialized = useRef(false)

  // Auto-initialize auth on mount
  useEffect(() => {
    // Prevent duplicate initialization
    if (hasInitialized.current || auth.isInitialized) {
      return
    }

    hasInitialized.current = true

    const initializeAuth = async () => {
      setAuth((prev) => ({ ...prev, isLoading: true }))

      const accessToken = cookieStorage.getAccessToken()

      // No token = user not logged in
      if (!accessToken) {
        setAuth({
          user: null,
          isInitialized: true,
          isLoading: false,
          error: null,
        })
        return
      }

      // Fetch user data from API
      try {
        const response = await AuthService.getCurrentUser()
        setAuth({
          user: response.data,
          isInitialized: true,
          isLoading: false,
          error: null,
        })
      } catch (error: any) {
        console.error('Failed to load user data:', error)

        // Clear invalid token on 401
        if (error?.response?.status === 401) {
          cookieStorage.clearTokens()
        }

        setAuth({
          user: null,
          isInitialized: true,
          isLoading: false,
          error: error?.message || 'Failed to load user data',
        })
      }
    }

    initializeAuth()
  }, [auth.isInitialized, setAuth])

  /**
   * Set user after successful login
   * Called by login mutation after authentication
   */
  const setUser = useCallback(
    (user: typeof auth.user) => {
      setAuth((prev) => ({
        ...prev,
        user,
        isInitialized: true,
        isLoading: false,
        error: null,
      }))
    },
    [setAuth]
  )

  /**
   * Clear user data and tokens
   * Called by logout mutation
   */
  const clearAuth = useCallback(() => {
    cookieStorage.clearTokens()
    setAuth({
      user: null,
      isInitialized: true,
      isLoading: false,
      error: null,
    })
  }, [setAuth])

  return {
    /** Current authenticated user (null if not logged in) */
    user: auth.user,
    /** Whether user is authenticated */
    isAuthenticated,
    /** Whether initial auth check is complete */
    isReady,
    /** Whether auth is currently loading */
    isLoading: auth.isLoading,
    /** Auth error message */
    error: auth.error,
    /** Set user after login */
    setUser,
    /** Clear auth data (for logout) */
    clearAuth,
  }
}
