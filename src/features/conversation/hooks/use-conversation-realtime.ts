import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Socket } from 'socket.io-client'
import { conversationKeys } from './use-conversation'

interface UseConversationRealtimeOptions {
  socket: Socket | null
  currentUserId: number
  refetchConversations: () => void
}

/**
 * Hook to handle real-time updates for conversation list
 */
export function useConversationRealtime({
  socket,
  currentUserId,
  refetchConversations,
}: UseConversationRealtimeOptions) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return

    console.log('📋 [CONVERSATION_REALTIME] Setting up real-time listeners')

    const handleMessageReceived = (message: any) => {
      try {
        const key = conversationKeys.list({ userId: currentUserId })
        queryClient.setQueryData<any>(key, (old: any) => {
          if (!old) {
            refetchConversations()
            return old
          }

          const conversations =
            old?.data?.conversations ||
            old?.conversations ||
            (Array.isArray(old) ? old : [])
          const idx = conversations.findIndex(
            (c: any) => c.id === message.conversation_id,
          )
          if (idx === -1) {
            refetchConversations()
            return old
          }

          const updated = [...conversations]
          updated[idx] = {
            ...updated[idx],
            last_message: {
              id: message.id,
              content: message.content,
              timestamp: message.timestamp,
            },
          }

          if (old?.data?.conversations) {
            return { ...old, data: { ...old.data, conversations: updated } }
          } else if (old?.conversations) {
            return { ...old, conversations: updated }
          }
          return updated
        })
      } catch (e) {
        refetchConversations()
      }
    }

    const handleMessagesRead = (_data: any) => {
      refetchConversations()
    }

    socket.on('message:received', handleMessageReceived)
    socket.on('messages:read', handleMessagesRead)

    return () => {
      socket.off('message:received', handleMessageReceived)
      socket.off('messages:read', handleMessagesRead)
    }
  }, [socket, currentUserId, queryClient, refetchConversations])
}
