import { useEffect, useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
    SOCKET_EVENTS,
    MessageStatus,
    MessageType,
    type SendMessagePayload,
    type JoinConversationPayload,
    type MessageReceivedResponse,
    type MessageSentResponse,
    type MessageErrorResponse,
    type UserTypingResponse,
    type MessageStatusUpdatedResponse,
    type ConversationJoinedResponse,
} from '../types/socket-events'
import type { TypedSocket } from './useSocketManager'
import { conversationKeys } from './use-conversation'
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
    const pendingMessagesRef = useRef<Map<string, MessageReceivedResponse>>(new Map())

    /**
     * Join conversation room
     */
    const joinConversation = useCallback(() => {
        if (!socket?.connected || !enabled) return

        const payload: JoinConversationPayload = {
            conversation_id: conversationId,
            user_id: userId,
        }

        socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, payload)
    }, [socket, conversationId, userId, enabled])

    /**
     * Leave conversation room
     */
    const leaveConversation = useCallback(() => {
        if (!socket?.connected) return

        socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, {
            conversation_id: conversationId,
        })
        setIsJoined(false)
    }, [socket, conversationId])

    /**
     * Send message with optimistic update
     */
    const sendMessage = useCallback(
        (content: string, messageType: MessageType = MessageType.TEXT) => {
            if (!socket?.connected || !content.trim()) return

            const clientId = `client-${Date.now()}-${Math.random()}`

            // Create optimistic message
            const optimisticMessage: MessageReceivedResponse = {
                id: -1, // Temporary ID
                sender_id: userId,
                conversation_id: conversationId,
                content: content.trim(),
                message_type: messageType,
                timestamp: new Date().toISOString(),
                status: MessageStatus.SENDING,
                client_id: clientId,
            }

            // Add to pending messages
            pendingMessagesRef.current.set(clientId, optimisticMessage)

            // Optimistically update cache
            queryClient.setQueryData<{ messages: Message[] }>(
                conversationKeys.messages(conversationId),
                (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        messages: [...old.messages, optimisticMessage as unknown as Message],
                    }
                }
            )

            // Send to server
            const payload: SendMessagePayload = {
                sender_id: userId,
                conversation_id: conversationId,
                content: content.trim(),
                message_type: messageType,
                client_id: clientId,
            }

            socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload)

            return clientId
        },
        [socket, conversationId, userId, queryClient]
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
        [socket, conversationId, userId]
    )

    /**
     * Handle message received from server
     */
    useEffect(() => {
        if (!socket || !enabled) return

        const handleMessageReceived = (data: MessageReceivedResponse) => {
            // Only process messages for this conversation
            if (data.conversation_id !== conversationId) return

            console.log('📨 Message received:', data)

            // Update messages cache
            queryClient.setQueryData<{ messages: Message[] }>(
                conversationKeys.messages(conversationId),
                (old) => {
                    if (!old) return old

                    // Check if message already exists (from optimistic update)
                    const existingIndex = old.messages.findIndex(
                        m => m.id === data.id || (m as any).client_id === data.client_id
                    )

                    if (existingIndex !== -1) {
                        // Update existing message
                        const newMessages = [...old.messages]
                        newMessages[existingIndex] = data as unknown as Message
                        return { ...old, messages: newMessages }
                    } else {
                        // Add new message
                        return {
                            ...old,
                            messages: [...old.messages, data as unknown as Message],
                        }
                    }
                }
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
            console.log('✅ Message sent confirmation:', data)

            // Remove from pending messages
            if (data.client_id) {
                pendingMessagesRef.current.delete(data.client_id)
            }

            // Update message in cache with server ID
            queryClient.setQueryData<{ messages: Message[] }>(
                conversationKeys.messages(conversationId),
                (old) => {
                    if (!old) return old

                    const messages = old.messages.map(m => {
                        if ((m as any).client_id === data.client_id) {
                            return { ...data, status: MessageStatus.SENT } as unknown as Message
                        }
                        return m
                    })

                    return { ...old, messages }
                }
            )
        }

        const handleMessageError = (data: MessageErrorResponse) => {
            console.error('❌ Message error:', data)

            const clientId = data.details?.client_id

            // Mark message as failed
            if (clientId) {
                queryClient.setQueryData<{ messages: Message[] }>(
                    conversationKeys.messages(conversationId),
                    (old) => {
                        if (!old) return old

                        const messages = old.messages.map(m => {
                            if ((m as any).client_id === clientId) {
                                return { ...m, status: MessageStatus.FAILED } as Message
                            }
                            return m
                        })

                        return { ...old, messages }
                    }
                )

                pendingMessagesRef.current.delete(clientId)
            }

            // TODO: Show error toast
        }

        const handleMessageStatusUpdated = (data: MessageStatusUpdatedResponse) => {
            console.log('📊 Message status updated:', data)

            queryClient.setQueryData<{ messages: Message[] }>(
                conversationKeys.messages(conversationId),
                (old) => {
                    if (!old) return old

                    const messages = old.messages.map(m => {
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

                    return { ...old, messages }
                }
            )
        }

        const handleConversationJoined = (data: ConversationJoinedResponse) => {
            console.log('✅ Joined conversation:', data)
            setIsJoined(true)
            setOnlineParticipants(data.online_participants)
        }

        const handleUserTyping = (data: UserTypingResponse) => {
            if (data.conversation_id !== conversationId || data.user_id === userId) {
                return
            }

            setTypingUsers(prev => {
                if (data.is_typing) {
                    // Add user to typing list
                    if (!prev.find(u => u.userId === data.user_id)) {
                        return [
                            ...prev,
                            { userId: data.user_id, userName: data.user_name },
                        ]
                    }
                } else {
                    // Remove user from typing list
                    return prev.filter(u => u.userId !== data.user_id)
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

        return () => {
            socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
            socket.off(SOCKET_EVENTS.MESSAGE_SENT, handleMessageSent)
            socket.off(SOCKET_EVENTS.MESSAGE_ERROR, handleMessageError)
            socket.off(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleMessageStatusUpdated)
            socket.off(SOCKET_EVENTS.CONVERSATION_JOINED, handleConversationJoined)
            socket.off(SOCKET_EVENTS.USER_TYPING, handleUserTyping)
        }
    }, [socket, conversationId, userId, enabled, queryClient, markAsRead])

    /**
     * Auto-join conversation when enabled
     */
    useEffect(() => {
        if (enabled && socket?.connected && !isJoined) {
            joinConversation()
        }

        return () => {
            if (isJoined) {
                leaveConversation()
            }
        }
    }, [enabled, socket, isJoined, joinConversation, leaveConversation])

    return {
        sendMessage,
        markAsRead,
        joinConversation,
        leaveConversation,
        isJoined,
        typingUsers,
        onlineParticipants,
    }
}
