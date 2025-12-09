import { useQuery } from '@tanstack/react-query'
import { ConversationService } from '../api/conversation-service'
import { conversationKeys } from './use-conversation-queries'

/**
 * Unified hook for managing all unread counts
 * Replaces: useUnreadCount, useUnreadByConversation, useUnreadConversationsCount
 *
 * IMPORTANT: This hook only fetches initial data
 * Real-time updates are handled by useGlobalConversationSync at root level
 */
export function useUnreadCounts(userId: number | undefined) {
  // Query: Total unread messages
  const totalQuery = useQuery({
    queryKey: conversationKeys.unread.total(userId!),
    queryFn: async () => {
      const response = await ConversationService.getUnreadCount(userId!)
      return response.data
    },
    enabled: !!userId,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  })

  // Query: Unread count by conversation
  const byConversationQuery = useQuery({
    queryKey: conversationKeys.unread.byConversation(userId!),
    queryFn: () => ConversationService.getUnreadCountByConversation(userId!),
    enabled: !!userId,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
  })

  // Transform by-conversation data to map
  const unreadByConversation =
    byConversationQuery.data?.data?.reduce(
      (acc: Record<number, number>, item: any) => {
        acc[item.conversation_id] = item.unread_count
        return acc
      },
      {} as Record<number, number>,
    ) || {}

  // Derive conversations count from byConversation data (real-time from cache)
  const conversationsWithUnread =
    byConversationQuery.data?.data?.filter(
      (conv: any) => conv.unread_count > 0,
    ) || []
  const unreadConversationsCount = conversationsWithUnread.length

  return {
    // Total unread messages
    unreadCount: totalQuery.data || 0,
    // Unread per conversation
    unreadByConversation,
    // Number of conversations with unread (derived from byConversation)
    unreadConversationsCount,
    // Loading states
    isLoading: totalQuery.isLoading || byConversationQuery.isLoading,
    // Error states
    error: totalQuery.error || byConversationQuery.error,
    // Refetch functions
    refetch: () => {
      totalQuery.refetch()
      byConversationQuery.refetch()
    },
  }
}
