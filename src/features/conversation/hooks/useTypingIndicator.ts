import { useCallback, useEffect, useRef } from 'react'
import { SOCKET_EVENTS, type TypingPayload } from '../types/socket-events'
import type { TypedSocket } from './useSocketManager'

interface UseTypingIndicatorOptions {
    socket: TypedSocket | null
    conversationId: number
    userId: number
    debounceMs?: number
}

/**
 * Hook for managing typing indicators with debouncing
 * Automatically stops typing after inactivity
 */
export function useTypingIndicator(options: UseTypingIndicatorOptions) {
    const { socket, conversationId, userId, debounceMs = 1000 } = options

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isTypingRef = useRef(false)

    /**
     * Start typing indicator
     */
    const startTyping = useCallback(() => {
        if (!socket?.connected) return

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Only emit if not already typing
        if (!isTypingRef.current) {
            const payload: TypingPayload = {
                conversation_id: conversationId,
                user_id: userId,
                is_typing: true,
            }

            socket.emit(SOCKET_EVENTS.TYPING_START, payload)
            isTypingRef.current = true
        }

        // Auto-stop after debounce period
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping()
        }, debounceMs)
    }, [socket, conversationId, userId, debounceMs])

    /**
     * Stop typing indicator
     */
    const stopTyping = useCallback(() => {
        if (!socket?.connected) return

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }

        if (isTypingRef.current) {
            const payload: TypingPayload = {
                conversation_id: conversationId,
                user_id: userId,
                is_typing: false,
            }

            socket.emit(SOCKET_EVENTS.TYPING_STOP, payload)
            isTypingRef.current = false
        }
    }, [socket, conversationId, userId])

    /**
     * Handle input change - debounced typing
     */
    const handleInputChange = useCallback(() => {
        startTyping()
    }, [startTyping])

    /**
     * Cleanup on unmount or conversation change
     */
    useEffect(() => {
        return () => {
            stopTyping()
        }
    }, [stopTyping])

    return {
        startTyping,
        stopTyping,
        handleInputChange,
        isTyping: isTypingRef.current,
    }
}
