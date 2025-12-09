/**
 * Refactored hooks for conversation feature
 * Optimized for performance and maintainability
 */

// Core queries and mutations
export * from './use-conversation-queries'

// Real-time chat with socket
export { useRealtimeChat } from './use-realtime-chat'

// Unified unread management
export { useUnreadCounts } from './use-unread-counts'

// Global sync (mount at root)
export {
  useGlobalConversationSync,
  useChatBehavior,
} from './use-conversation-sync'

// Utils (file + formatters)
export { useChatUtils } from './use-chat-utils'

// Search functionality
export { useConversationSearch } from './use-conversation-search'

// Message notifications
export { useMessageNotifications } from './use-message-notifications'

// Re-export keys for external use
export { conversationKeys } from './use-conversation-queries'
