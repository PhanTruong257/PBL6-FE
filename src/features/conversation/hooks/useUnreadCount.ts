import { useQuery } from '@tanstack/react-query'
import { useSocket } from '@/global/hooks'
import { useEffect } from 'react'
import { ConversationService } from '../api/conversation-service'
import { SOCKET_EVENTS } from '../types/socket-events'

/**
 * Hook để lấy số lượng tin nhắn chưa đọc
 * - Query từ API
 * - Update real-time qua Socket.IO
 */
export function useUnreadCount(userId: number | undefined, enabled = true) {
  const { socket, isConnected } = useSocket()

  // Query unread count
  const query = useQuery({
    queryKey: ['unread-count', userId],
    queryFn: async () => {
      const response = await ConversationService.getUnreadCount(userId!)
      return { count: response.data }
    },
    enabled: enabled && !!userId,
    refetchInterval: 30000, // Refetch every 30s
    staleTime: 10000,
  })

  // Listen for real-time updates
  useEffect(() => {
    if (!socket || !isConnected || !userId) return

    console.log(
      '🔔 [UNREAD_COUNT] Setting up real-time listeners for user:',
      userId,
    )

    // Refetch count when new message received (from others)
    const handleMessageReceived = (data: any) => {
      console.log('🔔 [UNREAD_COUNT] Message received:', data)
      // Only count messages from others
      if (data.sender_id !== userId) {
        // Small delay to ensure DB has been updated
        setTimeout(() => {
          console.log('🔔 [UNREAD_COUNT] Refetching unread count...')
          query.refetch()
        }, 300)
      }
    }

    // Refetch count when messages marked as read
    const handleMessageStatusUpdated = (data: any) => {
      console.log('🔔 [UNREAD_COUNT] Message status updated:', data)
      if (data.status === 'read') {
        query.refetch()
      }
    }

    // Refetch when messages are marked as read via API
    const handleMessagesRead = (data: any) => {
      console.log('🔔 [UNREAD_COUNT] Messages read event:', data)
      query.refetch()
    }

    socket.on('message:received', handleMessageReceived)
    socket.on('message:status', handleMessageStatusUpdated)
    socket.on(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead)

    return () => {
      socket.off('message:received', handleMessageReceived)
      socket.off('message:status', handleMessageStatusUpdated)
      socket.off(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead)
    }
  }, [socket, isConnected, userId, query])

  return {
    unreadCount: query.data?.count || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
