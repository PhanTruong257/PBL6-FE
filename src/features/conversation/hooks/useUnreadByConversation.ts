import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSocket } from '@/global/hooks'
import { ConversationService } from '../api/conversation-service'
import { SOCKET_EVENTS } from '../types/socket-events'

/**
 * Hook to get unread message count grouped by conversation
 * Updates in real-time via socket listeners
 */
export function useUnreadByConversation(userId: number | undefined) {
  const { socket } = useSocket()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['unread-by-conversation', userId],
    queryFn: () => ConversationService.getUnreadCountByConversation(userId!),
    enabled: !!userId,
    staleTime: 30000, // 30 seconds
  })

  // Listen to socket events and update unread counts
  useEffect(() => {
    if (!socket || !userId) {
      console.log('⚠️ [UNREAD_BY_CONVERSATION] Socket or userId not available')
      return
    }

    console.log(
      '✅ [UNREAD_BY_CONVERSATION] Setting up socket listeners for userId:',
      userId,
    )

    // When a new message is received, refetch to update counts
    const handleMessageReceived = (message: any) => {
      console.log('📨 [UNREAD_BY_CONVERSATION] Message received:', message)
      // Only refetch if message is for this user (sender_id !== userId)
      if (message.sender_id !== userId) {
        console.log(
          '🔄 [UNREAD_BY_CONVERSATION] Refetching unread counts (with delay for DB sync)...',
        )
        // Small delay to ensure DB has been updated
        setTimeout(() => {
          refetch()
        }, 300)
      }
    }

    // When messages are marked as read, refetch to update counts
    const handleMessageStatus = (status: any) => {
      console.log('✅ [UNREAD_BY_CONVERSATION] Message status updated:', status)
      if (status.status === 'read') {
        console.log(
          '🔄 [UNREAD_BY_CONVERSATION] Refetching after read status...',
        )
        refetch()
      }
    }

    // When messages are marked as read via API
    const handleMessagesRead = (data: any) => {
      console.log('📖 [UNREAD_BY_CONVERSATION] Messages marked as read:', data)
      console.log(
        '🔄 [UNREAD_BY_CONVERSATION] Refetching after messages read...',
      )
      refetch()
    }

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    socket.on(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleMessageStatus)
    socket.on(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead)

    return () => {
      console.log('🧹 [UNREAD_BY_CONVERSATION] Cleaning up socket listeners')
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
      socket.off(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleMessageStatus)
      socket.off(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead)
    }
  }, [socket, userId, refetch])

  // Transform data to a map for easier lookup
  const unreadByConversation =
    data?.data?.reduce(
      (acc: Record<number, number>, item: any) => {
        acc[item.conversation_id] = item.unread_count
        return acc
      },
      {} as Record<number, number>,
    ) || {}

  return {
    unreadByConversation,
    isLoading,
    error,
    refetch,
  }
}
