import { useEffect, useRef, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { currentUserState } from '@/global/recoil/user'
import { useSocket } from '@/global/hooks'
import {
  POST_SOCKET_EVENTS,
  type PostCreatedResponse,
  type ReplyCreatedResponse,
  type ClassJoinedResponse,
} from '@/features/class/types/socket-events'

interface UseClassSocketOptions {
  classId: number | null
  onPostCreated?: (post: PostCreatedResponse) => void
  onReplyCreated?: (reply: ReplyCreatedResponse) => void
}

/**
 * Hook to manage real-time socket events for a specific class
 */
export function useClassSocket({
  classId,
  onPostCreated,
  onReplyCreated,
}: UseClassSocketOptions) {
  const { socket, isConnected } = useSocket()
  const currentUser = useRecoilValue(currentUserState)
  const queryClient = useQueryClient()
  const hasJoinedRef = useRef(false)

  // Join class room
  useEffect(() => {
    if (
      !socket ||
      !isConnected ||
      !classId ||
      !currentUser?.user_id ||
      hasJoinedRef.current
    ) {
      return
    }

    console.log('📚 [CLASS_SOCKET] Joining class room:', classId)
    socket.emit(POST_SOCKET_EVENTS.JOIN_CLASS, {
      class_id: classId,
      user_id: currentUser.user_id,
    })

    hasJoinedRef.current = true

    return () => {
      if (socket && classId) {
        console.log('📚 [CLASS_SOCKET] Leaving class room:', classId)
        socket.emit(POST_SOCKET_EVENTS.LEAVE_CLASS, {
          class_id: classId,
        })
        hasJoinedRef.current = false
      }
    }
  }, [socket, isConnected, classId, currentUser?.user_id])

  // Listen for class joined confirmation
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleClassJoined = (data: ClassJoinedResponse) => {
      console.log('✅ [CLASS_SOCKET] Joined class:', data)
    }

    socket.on(POST_SOCKET_EVENTS.CLASS_JOINED, handleClassJoined)

    return () => {
      socket.off(POST_SOCKET_EVENTS.CLASS_JOINED, handleClassJoined)
    }
  }, [socket, isConnected])

  // Listen for new posts
  useEffect(() => {
    if (!socket || !isConnected || !classId) return

    const handlePostCreated = (data: PostCreatedResponse) => {
      console.log('🆕 [CLASS_SOCKET] New post received:', data)

      // Don't show notification for own posts
      if (data.sender_id !== currentUser?.user_id) {
        toast.info('Bài viết mới', {
          description: data.title || data.message.substring(0, 50),
        })
      }

      // Invalidate class detail query to refetch posts
      // Convert classId to string to match the query key format
      queryClient.invalidateQueries({ queryKey: ['class', classId.toString()] })

      // Call custom callback if provided
      if (onPostCreated) {
        onPostCreated(data)
      }
    }

    socket.on(POST_SOCKET_EVENTS.POST_CREATED, handlePostCreated)

    return () => {
      socket.off(POST_SOCKET_EVENTS.POST_CREATED, handlePostCreated)
    }
  }, [
    socket,
    isConnected,
    classId,
    currentUser?.user_id,
    queryClient,
    onPostCreated,
  ])

  // Listen for new replies
  useEffect(() => {
    if (!socket || !isConnected || !classId) return

    const handleReplyCreated = (data: ReplyCreatedResponse) => {
      console.log('💬 [CLASS_SOCKET] New reply received:', data)

      // Don't show notification for own replies
      if (data.sender_id !== currentUser?.user_id) {
        toast.info('Có trả lời mới', {
          description: data.message.substring(0, 50),
        })
      }

      // Invalidate class detail query to refetch posts
      // Convert classId to string to match the query key format
      queryClient.invalidateQueries({ queryKey: ['class', classId.toString()] })

      // Call custom callback if provided
      if (onReplyCreated) {
        onReplyCreated(data)
      }
    }

    socket.on(POST_SOCKET_EVENTS.REPLY_CREATED, handleReplyCreated)

    return () => {
      socket.off(POST_SOCKET_EVENTS.REPLY_CREATED, handleReplyCreated)
    }
  }, [
    socket,
    isConnected,
    classId,
    currentUser?.user_id,
    queryClient,
    onReplyCreated,
  ])

  // Helper to send post via socket (optional - we're using REST API)
  const sendPost = useCallback(
    (title: string, message: string) => {
      if (!socket || !isConnected || !classId || !currentUser?.user_id) {
        console.warn('❌ [CLASS_SOCKET] Cannot send post - socket not ready')
        return
      }

      socket.emit(POST_SOCKET_EVENTS.CREATE_POST, {
        class_id: classId,
        sender_id: currentUser.user_id,
        title,
        message,
      })
    },
    [socket, isConnected, classId, currentUser?.user_id],
  )

  // Helper to send reply via socket (optional - we're using REST API)
  const sendReply = useCallback(
    (parentId: number, message: string) => {
      if (!socket || !isConnected || !classId || !currentUser?.user_id) {
        console.warn('❌ [CLASS_SOCKET] Cannot send reply - socket not ready')
        return
      }

      socket.emit(POST_SOCKET_EVENTS.CREATE_REPLY, {
        class_id: classId,
        parent_id: parentId,
        sender_id: currentUser.user_id,
        message,
      })
    },
    [socket, isConnected, classId, currentUser?.user_id],
  )

  return {
    isConnected,
    sendPost,
    sendReply,
  }
}
