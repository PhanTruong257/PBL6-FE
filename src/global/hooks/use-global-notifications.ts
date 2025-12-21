import { useAuth } from './use-auth'
import {
  useGlobalConversationSync,
  useMessageNotifications,
} from '@/features/conversation/hooks'
import { useClassNotifications } from '@/features/class/detail-class/hooks'

/**
 * Setup all global notification hooks
 * Consolidates notification logic in one place
 *
 * This hook manages:
 * 1. Global conversation sync (WebSocket connection for real-time messages)
 * 2. Message notifications (popup notifications for new messages)
 * 3. Class notifications (popup notifications for new posts and replies)
 *
 * All hooks are automatically active when user is logged in.
 * They gracefully handle null user state when not authenticated.
 *
 * Only activates after auth is ready to avoid unnecessary API calls.
 *
 * @example
 * ```tsx
 * function RootComponent() {
 *   useGlobalNotifications()
 *   return <Outlet />
 * }
 * ```
 */
export function useGlobalNotifications() {
  const { user, isReady } = useAuth()

  // Only setup notifications when auth is ready
  // This prevents unnecessary WebSocket connections before auth check completes
  const userId = isReady ? user?.user_id : undefined
  const userRole = isReady ? user?.role : undefined

  // Global conversation sync - always active regardless of route
  // Maintains WebSocket connection for real-time message updates
  useGlobalConversationSync(userId)

  // Message notifications - show popup for new messages
  // Displays toast notifications when new messages arrive
  useMessageNotifications({ userId })

  // Class notifications - show popup for new posts and replies
  // Automatically joins all user's classes to receive notifications globally
  useClassNotifications({
    userId,
    userRole,
  })
}
