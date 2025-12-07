import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/global/hooks'
import { conversationKeys } from './use-conversation-queries'
import type { Message } from '../types'
import { SOCKET_EVENTS } from '../types/socket-events'

/**
 * Global message listener for all conversations
 * Mounts at root level to always listen for messages
 * Handles: message caching, conversation list updates, unread counts
 */
export function useGlobalConversationSync(userId: number | undefined) {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket || !userId) return

    const handleMessageReceived = (message: any) => {
      const messageWithReadStatus = {
        ...message,
        is_read:
          message.sender_id === userId ? true : (message.is_read ?? false),
      } as Message

      // 1. Cache message
      const messagesKey = conversationKeys.messages(message.conversation_id)
      queryClient.setQueryData<any>(messagesKey, (old: any) => {
        if (!old) {
          return { messages: [messageWithReadStatus] }
        }

        const currentMessages = old?.data?.messages || old?.messages || []
        const existingIndex = currentMessages.findIndex(
          (m: any) =>
            m.id === message.id ||
            (message.client_id && m.client_id === message.client_id),
        )

        let newMessages: Message[]
        if (existingIndex !== -1) {
          newMessages = [...currentMessages]
          newMessages[existingIndex] = messageWithReadStatus
        } else {
          newMessages = [...currentMessages, messageWithReadStatus]
        }

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
      })

      // 2. Update conversation list
      const conversationKey = conversationKeys.list({ userId })
      queryClient.setQueryData<any>(conversationKey, (old: any) => {
        if (!old) return old

        const conversations =
          old?.data?.conversations ||
          old?.conversations ||
          (Array.isArray(old) ? old : [])

        const idx = conversations.findIndex(
          (c: any) => c.id === message.conversation_id,
        )

        if (idx === -1) return old

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

      // 3. Update unread counts (only for messages from others)
      if (message.sender_id !== userId) {
        // Update by-conversation count
        queryClient.setQueryData(
          conversationKeys.unread.byConversation(userId),
          (oldData: any) => {
            if (!oldData) {
              return {
                data: [
                  {
                    conversation_id: message.conversation_id,
                    unread_count: 1,
                  },
                ],
              }
            }

            const existingData = oldData.data || []
            const conversationIndex = existingData.findIndex(
              (item: any) => item.conversation_id === message.conversation_id,
            )

            let updatedData
            if (conversationIndex >= 0) {
              updatedData = [...existingData]
              updatedData[conversationIndex] = {
                ...updatedData[conversationIndex],
                unread_count: updatedData[conversationIndex].unread_count + 1,
              }
            } else {
              updatedData = [
                ...existingData,
                {
                  conversation_id: message.conversation_id,
                  unread_count: 1,
                },
              ]
            }

            return { ...oldData, data: updatedData }
          },
        )

        // Update total unread count
        queryClient.setQueryData(
          conversationKeys.unread.total(userId),
          (old: number = 0) => old + 1,
        )

        // Invalidate conversations count
        queryClient.invalidateQueries({
          queryKey: conversationKeys.unread.conversationsCount(userId),
        })
      }
    }

    const handleMessageStatus = (status: any) => {
      if (status.status === 'read' && status.conversation_id) {
        // Reset unread count for this conversation
        queryClient.setQueryData(
          conversationKeys.unread.byConversation(userId),
          (oldData: any) => {
            if (!oldData) return oldData

            const existingData = oldData.data || []
            const updatedData = existingData.map((item: any) =>
              item.conversation_id === status.conversation_id
                ? { ...item, unread_count: 0 }
                : item,
            )

            return { ...oldData, data: updatedData }
          },
        )

        // Refetch total and conversations count
        queryClient.invalidateQueries({
          queryKey: conversationKeys.unread.total(userId),
        })
        queryClient.invalidateQueries({
          queryKey: conversationKeys.unread.conversationsCount(userId),
        })
      }
    }

    const handleMessagesRead = (data: any) => {
      // Refetch conversation list
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() })

      // Update unread counts if conversation_id is provided
      if (data?.conversation_id) {
        handleMessageStatus({
          status: 'read',
          conversation_id: data.conversation_id,
        })
      }
    }

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    socket.on(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleMessageStatus)
    socket.on(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead)

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
      socket.off(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleMessageStatus)
      socket.off(SOCKET_EVENTS.MESSAGES_READ, handleMessagesRead)
    }
  }, [socket, userId, queryClient])
}

/**
 * Auto-scroll and mark as read behavior for chat window
 * Replaces: useChatMessages
 */
export function useChatBehavior(options: {
  conversationId?: number
  currentUserId: number
  messages: any[]
  markAsRead: (messageId: number) => void
}) {
  const { conversationId, currentUserId, messages, markAsRead } = options
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark as read on open
  useEffect(() => {
    if (!conversationId) return

    const markConversationAsRead = async () => {
      try {
        const { ConversationService } = await import(
          '../api/conversation-service'
        )
        await ConversationService.markAsRead(conversationId)
      } catch (error) {
        console.error('Failed to mark as read:', error)
      }
    }

    markConversationAsRead()
  }, [conversationId])

  // Mark as read on new message from others
  useEffect(() => {
    if (!conversationId || messages.length === 0) return

    const lastMessage = messages[messages.length - 1]
    if (
      lastMessage &&
      lastMessage.sender_id !== currentUserId &&
      lastMessage.id > 0
    ) {
      const markLastMessageAsRead = async () => {
        try {
          const { ConversationService } = await import(
            '../api/conversation-service'
          )
          await ConversationService.markAsRead(conversationId)
          markAsRead(lastMessage.id)
        } catch (error) {
          console.error('Failed to mark message as read:', error)
        }
      }

      markLastMessageAsRead()
    }
  }, [messages.length, conversationId, currentUserId, markAsRead])

  return { messagesEndRef }
}
