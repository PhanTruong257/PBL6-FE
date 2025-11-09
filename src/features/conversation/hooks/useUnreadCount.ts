import { useQuery } from '@tanstack/react-query'
import { useGlobalSocket } from '@/global/providers/socket-provider'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { ConversationService } from '../api/conversation-service'

interface UnreadCountResponse {
  count: number
}

/**
 * Hook để lấy số lượng tin nhắn chưa đọc
 * - Query từ API
 * - Update real-time qua Socket.IO
 */
export function useUnreadCount(userId: number | undefined, enabled = true) {
  const queryClient = useQueryClient()
  const { socket, isConnected } = useGlobalSocket()

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

    console.log('🔔 [UNREAD_COUNT] Listening for real-time updates')

    // Refetch count when new message received (from others)
    const handleMessageReceived = (data: any) => {
      console.log('📨 [UNREAD_COUNT] New message received:', data)

      // Only count messages from others
      if (data.sender_id !== userId) {
        console.log(
          '🔄 [UNREAD_COUNT] Refetching unread count from API (with delay for DB sync)...',
        )
        // Small delay to ensure DB has been updated
        setTimeout(() => {
          query.refetch()
        }, 300)
      }
    }

    // Refetch count when messages marked as read
    const handleMessageStatusUpdated = (data: any) => {
      console.log('✅ [UNREAD_COUNT] Message status updated:', data)

      if (data.status === 'read') {
        console.log('🔄 [UNREAD_COUNT] Refetching unread count from API...')
        query.refetch()
      }
    }

    // Refetch when messages are marked as read via API
    const handleMessagesRead = (data: any) => {
      console.log('📖 [UNREAD_COUNT] Messages marked as read:', data)
      console.log('🔄 [UNREAD_COUNT] Refetching unread count from API...')
      query.refetch()
    }

    socket.on('message:received', handleMessageReceived)
    socket.on('message:status', handleMessageStatusUpdated)
    socket.on('messages:read', handleMessagesRead)

    return () => {
      socket.off('message:received', handleMessageReceived)
      socket.off('message:status', handleMessageStatusUpdated)
      socket.off('messages:read', handleMessagesRead)
    }
  }, [socket, isConnected, userId, query])

  return {
    unreadCount: query.data?.count || 0,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
