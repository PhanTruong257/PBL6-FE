import { useEffect, useRef } from 'react'
import { ConversationService } from '../api/conversation-service'

interface UseChatMessagesOptions {
  conversationId?: number
  currentUserId: number
  messages: any[]
  markAsRead: (messageId: number) => void
}

/**
 * Hook to handle chat messages behavior (auto-scroll, mark as read)
 */
export function useChatMessages({
  conversationId,
  currentUserId,
  messages,
  markAsRead,
}: UseChatMessagesOptions) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!conversationId) return

    console.log('📖 [CHAT_MESSAGES] Conversation opened, marking as read...')

    ConversationService.markAsRead(conversationId)
      .then((response) => {
        console.log('✅ Marked conversation as read via API:', response)
      })
      .catch((error) => {
        console.error('❌ Failed to mark as read:', error)
      })
  }, [conversationId])

  // Mark as read when new messages arrive from others
  useEffect(() => {
    if (!conversationId || messages.length === 0) return

    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.sender_id !== currentUserId) {
      console.log(
        '📖 [CHAT_MESSAGES] New message from other user, marking as read...',
      )

      ConversationService.markAsRead(conversationId)
        .then(() => {
          console.log('✅ Marked new messages as read')
          markAsRead(lastMessage.id)
        })
        .catch((error) => {
          console.error('❌ Failed to mark as read:', error)
        })
    }
  }, [messages.length, conversationId, currentUserId, markAsRead])

  return {
    messagesEndRef,
  }
}
