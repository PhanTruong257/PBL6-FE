import { type ReactNode } from 'react'
import { useAuth } from '@/global/hooks/use-auth'
import { useGlobalNotifications } from '@/global/hooks/use-global-notifications'

/**
 * GlobalInitializer - Handles global app initialization
 *
 * Responsibilities:
 * 1. Initialize authentication (via useAuth hook)
 * 2. Setup global WebSocket listeners for messages and classes
 * 3. Initialize notification systems
 * 4. Other app-wide side effects
 *
 * The hooks inside check for user authentication state and gracefully
 * handle cases where the user is not logged in.
 *
 * Note: useAuth automatically initializes auth on first mount,
 * so no explicit initialization call needed.
 */
export function GlobalInitializer({ children }: { children: ReactNode }) {
  useAuth()

  useGlobalNotifications()

  return <>{children}</>
}
