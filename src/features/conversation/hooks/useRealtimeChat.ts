import { useEffect, useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  SOCKET_EVENTS,
  MessageStatus,
  MessageType,
  type JoinConversationPayload,
  type MessageReceivedResponse,
  type MessageSentResponse,
  type MessageErrorResponse,
  type UserTypingResponse,
  type MessageStatusUpdatedResponse,
  type ConversationJoinedResponse,
} from '../types/socket-events'
import type { TypedSocket } from './useSocketManager'
import { conversationKeys, useMessages } from './use-conversation'
import { ConversationService } from '../api'
import type { Message } from '../types'

interface UseRealtimeChatOptions {
  socket: TypedSocket | null
  conversationId: number
  userId: number
  enabled?: boolean
}

interface TypingUser {
  userId: number
  userName?: string
}

/**
 * Main hook for real-time chat functionality
 * Handles messages, typing indicators, and read receipts
 */
export function useRealtimeChat(options: UseRealtimeChatOptions) {
  const { socket, conversationId, userId, enabled = true } = options
  const queryClient = useQueryClient()

  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [onlineParticipants, setOnlineParticipants] = useState<number[]>([])

  // Track pending messages for optimistic updates
  const pendingMessagesRef = useRef<Map<string, MessageReceivedResponse>>(
    new Map(),
  )

  // Fetch initial messages from API
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useMessages(
    { conversation_id: conversationId, page: 1, limit: 50 },
    enabled && conversationId > 0,
  )

  /**
   * Join conversation room
   */
  const joinConversation = useCallback(() => {
    if (!socket?.connected || !enabled) {
      console.warn('⚠️ Cannot join conversation:', {
        socketConnected: socket?.connected,
        enabled,
      })
      return
    }

    const payload: JoinConversationPayload = {
      conversation_id: conversationId,
      user_id: userId,
    }

    console.log('🚀 Emitting JOIN_CONVERSATION:', payload)
    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, payload)
  }, [socket, conversationId, userId, enabled])

  /**
   * Leave conversation room
   */
  const leaveConversation = useCallback(() => {
    console.log('🚪 [LEAVE_CONVERSATION] Leaving conversation:', conversationId)

    if (!socket?.connected) {
      console.warn('⚠️ Socket not connected, cannot leave')
      return
    }

    socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, {
      conversation_id: conversationId,
    })
    setIsJoined(false)
  }, [socket, conversationId])

  /**
   * Send message with Frontend-first approach:
   * 1. Broadcast via Socket.IO immediately (real-time)
   * 2. Call REST API to save to DB (async, in background)
   */
  const sendMessage = useCallback(
    async (content: string, messageType: MessageType = MessageType.TEXT) => {
      if (!socket?.connected || !content.trim()) {
        console.warn('⚠️ Cannot send message:', {
          socketConnected: socket?.connected,
          hasContent: !!content.trim(),
        })
        return
      }

      const clientId = `client-${Date.now()}-${Math.random()}`
      const tempId = Date.now() * -1 // Negative timestamp as temporary ID (unique)

      // Create message for real-time broadcast
      const realtimeMessage: MessageReceivedResponse = {
        id: tempId,
        sender_id: userId,
        conversation_id: conversationId,
        content: content.trim(),
        message_type: messageType,
        timestamp: new Date().toISOString(),
        status: MessageStatus.SENDING,
        client_id: clientId,
      }

      console.log('💬 Real-time message created:', realtimeMessage)

      // Add to pending messages
      pendingMessagesRef.current.set(clientId, realtimeMessage)

      // ===== STEP 1: UPDATE LOCAL CACHE IMMEDIATELY =====
      queryClient.setQueryData<any>(
        conversationKeys.messages(conversationId),
        (old: any) => {
          if (!old) return { messages: [realtimeMessage as unknown as Message] }

          const currentMessages = old?.data?.messages || old?.messages || []
          const newMessages = [
            ...currentMessages,
            realtimeMessage as unknown as Message,
          ]

          if (old?.data?.messages) {
            return {
              ...old,
              data: { ...old.data, messages: newMessages },
            }
          } else if (old?.messages) {
            return { ...old, messages: newMessages }
          } else {
            return { messages: newMessages }
          }
        },
      )

      // ===== STEP 2: BROADCAST VIA SOCKET.IO (Real-time to other users) =====
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, realtimeMessage)

      // ===== STEP 3: SAVE TO DB VIA REST API (Async, in background) =====

      // Don't await - let it run in background
      ConversationService.sendMessage({
        sender_id: userId,
        conversation_id: conversationId,
        content: content.trim(),
        message_type: messageType as any, // Type cast for enum compatibility
      })
        .then((response) => {
          // Update cache with real DB ID
          queryClient.setQueryData<any>(
            conversationKeys.messages(conversationId),
            (old: any) => {
              if (!old) return old

              const currentMessages = old?.data?.messages || old?.messages || []
              const updatedMessages = currentMessages.map((m: any) => {
                if (m.client_id === clientId) {
                  return {
                    ...m,
                    id: response.data.id, // Real DB ID
                    status: MessageStatus.SENT,
                    timestamp: response.data.timestamp,
                  }
                }
                return m
              })

              if (old?.data?.messages) {
                return {
                  ...old,
                  data: { ...old.data, messages: updatedMessages },
                }
              } else if (old?.messages) {
                return { ...old, messages: updatedMessages }
              }
              return old
            },
          )

          // Remove from pending
          pendingMessagesRef.current.delete(clientId)

          // Invalidate conversations list to update last message
          queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
        })
        .catch((error) => {
          console.error('❌ Failed to save message to DB:', error)

          // Mark message as failed
          queryClient.setQueryData<any>(
            conversationKeys.messages(conversationId),
            (old: any) => {
              if (!old) return old

              const currentMessages = old?.data?.messages || old?.messages || []
              const updatedMessages = currentMessages.map((m: any) => {
                if (m.client_id === clientId) {
                  return { ...m, status: MessageStatus.FAILED }
                }
                return m
              })

              if (old?.data?.messages) {
                return {
                  ...old,
                  data: { ...old.data, messages: updatedMessages },
                }
              } else if (old?.messages) {
                return { ...old, messages: updatedMessages }
              }
              return old
            },
          )

          pendingMessagesRef.current.delete(clientId)
        })

      return clientId
    },
    [socket, conversationId, userId, queryClient],
  )

  /**
   * Mark messages as read
   */
  const markAsRead = useCallback(
    (lastMessageId: number) => {
      if (!socket?.connected) return

      socket.emit(SOCKET_EVENTS.MESSAGE_READ, {
        conversation_id: conversationId,
        user_id: userId,
        last_read_message_id: lastMessageId,
        read_at: new Date().toISOString(),
      })
    },
    [socket, conversationId, userId],
  )

  /**
   * Handle message received from server
   */
  useEffect(() => {
    if (!socket || !enabled) {
      console.log('⚠️ Socket event listeners NOT registered:', {
        socket: !!socket,
        enabled,
      })
      return
    }

    console.log(
      '✅ Registering Socket.IO event listeners for conversation:',
      conversationId,
    )

    const handleMessageReceived = (data: MessageReceivedResponse) => {
      console.log('📨 [MESSAGE_RECEIVED] Raw data:', data)

      // Only process messages for this conversation
      if (data.conversation_id !== conversationId) {
        console.log(
          '⏭️ Skipping message for different conversation:',
          data.conversation_id,
          'vs',
          conversationId,
        )
        return
      }

      // Skip if this is our own message (already in cache via optimistic update)
      if (
        data.sender_id === userId &&
        data.client_id &&
        pendingMessagesRef.current.has(data.client_id)
      ) {
        console.log(
          '⏭️ Skipping own message (already optimistically added):',
          data.client_id,
        )
        return
      }

      console.log(
        '✅ Processing message for current conversation:',
        conversationId,
      )

      // Update messages cache
      queryClient.setQueryData<any>(
        conversationKeys.messages(conversationId),
        (old: any) => {
          if (!old) return { messages: [data as unknown as Message] }

          // Extract current messages from different possible structures
          const currentMessages = old?.data?.messages || old?.messages || []

          // Check if message already exists (from optimistic update)
          const existingIndex = currentMessages.findIndex(
            (m: any) => m.id === data.id || m.client_id === data.client_id,
          )

          let newMessages: Message[]
          if (existingIndex !== -1) {
            // Update existing message
            newMessages = [...currentMessages]
            newMessages[existingIndex] = data as unknown as Message
          } else {
            // Add new message
            newMessages = [...currentMessages, data as unknown as Message]
          }

          // Preserve the original structure
          if (old?.data?.messages) {
            return {
              ...old,
              data: {
                ...old.data,
                messages: newMessages,
              },
            }
          } else if (old?.messages) {
            return {
              ...old,
              messages: newMessages,
            }
          } else {
            return { messages: newMessages }
          }
        },
      )

      // If message is from another user, mark as delivered
      if (data.sender_id !== userId) {
        socket.emit(SOCKET_EVENTS.MESSAGE_DELIVERED, {
          message_id: data.id,
          user_id: userId,
          delivered_at: new Date().toISOString(),
        })

        // Auto-mark as read if conversation is active
        if (document.visibilityState === 'visible') {
          setTimeout(() => {
            markAsRead(data.id)
          }, 500)
        }
      }

      // Invalidate conversations list to update last message
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })
    }

    const handleMessageSent = (data: MessageSentResponse) => {
      console.log('✅ [MESSAGE_SENT] Confirmation:', data)

      // Remove from pending messages
      if (data.client_id) {
        pendingMessagesRef.current.delete(data.client_id)
        console.log('🗑️ Removed pending message:', data.client_id)
      }

      // Update message in cache with server ID
      queryClient.setQueryData<any>(
        conversationKeys.messages(conversationId),
        (old: any) => {
          if (!old) return old

          const currentMessages = old?.data?.messages || old?.messages || []
          const messages = currentMessages.map((m: any) => {
            if (m.client_id === data.client_id) {
              return {
                ...data,
                status: MessageStatus.SENT,
              } as unknown as Message
            }
            return m
          })

          // Preserve the original structure
          if (old?.data?.messages) {
            return {
              ...old,
              data: { ...old.data, messages },
            }
          } else if (old?.messages) {
            return { ...old, messages }
          } else {
            return { messages }
          }
        },
      )
    }

    const handleMessageError = (data: MessageErrorResponse) => {
      console.error('❌ [MESSAGE_ERROR]:', data)

      const clientId = data.details?.client_id

      // Mark message as failed
      if (clientId) {
        queryClient.setQueryData<any>(
          conversationKeys.messages(conversationId),
          (old: any) => {
            if (!old) return old

            const currentMessages = old?.data?.messages || old?.messages || []
            const messages = currentMessages.map((m: any) => {
              if (m.client_id === clientId) {
                return { ...m, status: MessageStatus.FAILED } as Message
              }
              return m
            })

            // Preserve the original structure
            if (old?.data?.messages) {
              return {
                ...old,
                data: { ...old.data, messages },
              }
            } else if (old?.messages) {
              return { ...old, messages }
            } else {
              return { messages }
            }
          },
        )

        pendingMessagesRef.current.delete(clientId)
      }

      // TODO: Show error toast
    }

    const handleMessageStatusUpdated = (data: MessageStatusUpdatedResponse) => {
      console.log('📊 Message status updated:', data)

      queryClient.setQueryData<any>(
        conversationKeys.messages(conversationId),
        (old: any) => {
          if (!old) return old

          const currentMessages = old?.data?.messages || old?.messages || []
          const messages = currentMessages.map((m: any) => {
            if (data.message_id && m.id === data.message_id) {
              return { ...m, status: data.status } as Message
            }
            if (
              data.last_read_message_id &&
              m.id <= data.last_read_message_id &&
              m.sender_id === userId
            ) {
              return { ...m, status: MessageStatus.READ } as Message
            }
            return m
          })

          // Preserve the original structure
          if (old?.data?.messages) {
            return {
              ...old,
              data: { ...old.data, messages },
            }
          } else if (old?.messages) {
            return { ...old, messages }
          } else {
            return { messages }
          }
        },
      )
    }

    const handleConversationJoined = (data: ConversationJoinedResponse) => {
      console.log('✅ [CONVERSATION_JOINED]:', data)
      setIsJoined(true)
      setOnlineParticipants(data.online_participants)
    }

    const handleUserTyping = (data: UserTypingResponse) => {
      console.log('⌨️ [USER_TYPING]:', data)

      if (data.conversation_id !== conversationId || data.user_id === userId) {
        return
      }

      setTypingUsers((prev) => {
        if (data.is_typing) {
          // Add user to typing list
          if (!prev.find((u) => u.userId === data.user_id)) {
            return [...prev, { userId: data.user_id, userName: data.user_name }]
          }
        } else {
          // Remove user from typing list
          return prev.filter((u) => u.userId !== data.user_id)
        }
        return prev
      })
    }

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    socket.on(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent)
    socket.on(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError)
    socket.on(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleMessageStatusUpdated)
    socket.on(SOCKET_EVENTS.CONVERSATION_JOINED, handleConversationJoined)
    socket.on(SOCKET_EVENTS.USER_TYPING, handleUserTyping)

    console.log(
      '🎧 Socket.IO listeners registered:',
      Object.keys(SOCKET_EVENTS).filter((k) =>
        [
          'MESSAGE_RECEIVED',
          'MESSAGE_SENT',
          'MESSAGE_ERROR',
          'MESSAGE_STATUS_UPDATED',
          'CONVERSATION_JOINED',
          'USER_TYPING',
        ].includes(k),
      ),
    )

    return () => {
      console.log(
        '🔌 Cleaning up Socket.IO listeners for conversation:',
        conversationId,
      )
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
      socket.off(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent)
      socket.off(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError)
      socket.off(
        SOCKET_EVENTS.MESSAGE_STATUS_UPDATED,
        handleMessageStatusUpdated,
      )
      socket.off(SOCKET_EVENTS.CONVERSATION_JOINED, handleConversationJoined)
      socket.off(SOCKET_EVENTS.USER_TYPING, handleUserTyping)
    }
  }, [socket, conversationId, userId, enabled, queryClient, markAsRead])

  /**
   * Auto-join conversation when enabled and socket connected
   */
  useEffect(() => {
    if (enabled && socket?.connected && !isJoined) {
      console.log('🚪 Auto-joining conversation:', conversationId)
      joinConversation()
    }

    return () => {
      if (isJoined) {
        console.log('🚪 Leaving conversation on unmount:', conversationId)
        leaveConversation()
      }
    }
  }, [
    enabled,
    socket?.connected,
    isJoined,
    joinConversation,
    leaveConversation,
    conversationId,
  ])

  /**
   * Get messages from cache (updated by useMessages and real-time events)
   */
  const messagesQuery = queryClient.getQueryData<any>(
    conversationKeys.messages(conversationId),
  )

  // Extract messages from different possible response structures
  let messages: Message[] = []

  if (messagesData) {
    // First try to get from React Query result
    messages =
      messagesData?.data?.messages ||
      messagesData?.messages ||
      (Array.isArray(messagesData) ? messagesData : [])
  } else if (messagesQuery) {
    // Fallback to cache
    messages =
      messagesQuery?.data?.messages ||
      messagesQuery?.messages ||
      (Array.isArray(messagesQuery) ? messagesQuery : [])
  }

  // Sort messages by timestamp (oldest first, newest at bottom)
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return timeA - timeB
  })

  const isLoading = isLoadingMessages || (!socket?.connected && enabled)

  return {
    messages: sortedMessages || [],
    isLoading,
    sendMessage,
    markAsRead,
    joinConversation,
    leaveConversation,
    isJoined,
    typingUsers,
    onlineParticipants,
  }
}
