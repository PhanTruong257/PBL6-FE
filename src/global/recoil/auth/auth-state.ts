import { atom, selector } from 'recoil'
import type { User } from '@/types/user'

/**
 * Authentication state interface
 */
export interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null
  /** Whether initial auth check is complete */
  isInitialized: boolean
  /** Whether auth is currently loading */
  isLoading: boolean
  /** Auth error message (if any) */
  error: string | null
}

/**
 * Main authentication state atom
 * Consolidates all auth-related state in one place
 */
export const authState = atom<AuthState>({
  key: 'authState',
  default: {
    user: null,
    isInitialized: false,
    isLoading: false,
    error: null,
  },
})

/**
 * Selector to check if user is authenticated
 */
export const isAuthenticatedSelector = selector({
  key: 'isAuthenticated',
  get: ({ get }) => {
    const auth = get(authState)
    return auth.user !== null
  },
})

/**
 * Selector to check if auth initialization is complete
 */
export const isAuthReadySelector = selector({
  key: 'isAuthReady',
  get: ({ get }) => {
    const auth = get(authState)
    return auth.isInitialized
  },
})
