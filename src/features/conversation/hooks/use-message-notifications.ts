import { useEffect, useCallback } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '@/global/hooks'
import { SOCKET_EVENTS } from '../types/socket-events'
import { conversationKeys } from './use-conversation-queries'
import type { ConversationWithUser } from '../types'

interface MessageNotificationOptions {
  userId: number | undefined
  enabled?: boolean
}

/**
 * Hook to show browser notifications for new messages
 * Displays popup toast notifications that navigate to conversation on click
 */
export function useMessageNotifications({
  userId,
  enabled = true,
}: MessageNotificationOptions) {
  const { socket } = useSocket()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Request notification permission on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [enabled])

  const showNotification = useCallback(
    (message: any) => {
      // Don't show notification for own messages
      if (message.sender_id === userId) return

      // Don't show notification if user is already on conversation page
      if (window.location.pathname.startsWith('/conversation')) return

      // Get sender name from conversations cache
      let senderName = '  '

      // Try to get from conversations list cache
      const conversationsData = queryClient.getQueryData<any>(
        conversationKeys.list({ userId }),
      )

      if (conversationsData) {
        const conversations =
          conversationsData?.data?.conversations ||
          conversationsData?.conversations ||
          (Array.isArray(conversationsData) ? conversationsData : [])

        const conversation = conversations.find(
          (conv: ConversationWithUser) => conv.id === message.conversation_id,
        )

        if (conversation) {
          // If sender is receiver in conversation, use receiver_name
          if (conversation.receiver_id === message.sender_id) {
            senderName = conversation.receiver_name
          }
        }
      }

      const content =
        message.content ||
        (message.file_url ? '📎 Đã gửi một file' : 'Tin nhắn mới')

      // Show toast notification with click action
      const toastId = toast(senderName, {
        description:
          content.length > 100 ? content.substring(0, 100) + '...' : content,
        duration: 5000,
        action: {
          label: 'Xem',
          onClick: () => {
            router.navigate({
              to: '/conversation',
              search: { conversationId: message.conversation_id },
            })
            toast.dismiss(toastId)
          },
        },
      })

      // Show browser notification if user is not on conversation page
      if (
        'Notification' in window &&
        Notification.permission === 'granted' &&
        !window.location.pathname.startsWith('/conversation')
      ) {
        const notification = new Notification(senderName, {
          body: content,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: `message-${message.conversation_id}`,
        })

        notification.onclick = () => {
          window.focus()
          router.navigate({
            to: '/conversation',
            search: { conversationId: message.conversation_id },
          })
          notification.close()
        }
      }
    },
    [userId, router],
  )

  useEffect(() => {
    if (!socket || !userId || !enabled) return

    const handleMessageReceived = (message: any) => {
      showNotification(message)
    }

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessageReceived)
    }
  }, [socket, userId, enabled, showNotification])
}
