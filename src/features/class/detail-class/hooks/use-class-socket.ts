import { useEffect, useRef, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { useQueryClient } from '@tanstack/react-query'
import { currentUserState } from '@/global/recoil/user'
import { useSocket, useAllUsers } from '@/global/hooks'
import {
  CLASS_SOCKET_EVENTS,
  type PostCreatedResponse,
  type ReplyCreatedResponse,
  type ClassJoinedResponse,
} from '@/features/conversation/types/socket-events'
import type { PostCardProps, ClassDetailData } from '../types'
import { classKeys } from './use-class-detail'
import type { User } from '@/types'

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

  // Get all users for user info lookup
  const { users: allUsers } = useAllUsers()

  // Default user for fallback
  const defaultUser: User = {
    user_id: 0,
    role: 'user',
    email: 'unknown@gmail.com',
    isEmailVerified: true,
    status: 'active',
    createdAt: '',
    updatedAt: '',
  }

  // Helper function to get user info from user id
  const getUserInfo = useCallback(
    (userId: number): User => {
      const user = allUsers.find((u) => u.user_id === userId)
      return (
        user || {
          ...defaultUser,
          user_id: userId,
          email: `user${userId}@gmail.com`,
        }
      )
    },
    [allUsers],
  )

  // Join class room
  useEffect(() => {
    if (
      !socket ||
      !isConnected ||
      !classId ||
      !currentUser?.user_id ||
      hasJoinedRef.current
    ) {
      console.log('📚 [CLASS_SOCKET] Skip join - conditions not met:', {
        hasSocket: !!socket,
        isConnected,
        classId,
        userId: currentUser?.user_id,
        hasJoined: hasJoinedRef.current,
      })
      return
    }

    console.log('📚 [CLASS_SOCKET] Joining class room:', classId)
    socket.emit(CLASS_SOCKET_EVENTS.JOIN_CLASS, {
      class_id: classId,
      user_id: currentUser.user_id,
    })

    hasJoinedRef.current = true

    // NOTE: Don't leave class on unmount
    // Global notification hook (useClassNotifications) already handles joining/leaving all classes
    // If we leave here, it will disconnect the global listener too
    return () => {
      hasJoinedRef.current = false
      // Removed socket.emit(LEAVE_CLASS) - let global hook manage it
    }
  }, [socket, isConnected, classId, currentUser?.user_id])

  // Listen for class joined confirmation
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleClassJoined = (data: ClassJoinedResponse) => {
      console.log('✅ [CLASS_SOCKET] Joined class:', data)
    }

    // Debug: Listen to ALL events to see what's coming through
    const handleAnyEvent = (...args: any[]) => {
      console.log('🔵 [CLASS_SOCKET] Received event:', args)
    }

    socket.onAny(handleAnyEvent)
    socket.on(CLASS_SOCKET_EVENTS.CLASS_JOINED, handleClassJoined)

    return () => {
      socket.offAny(handleAnyEvent)
      socket.off(CLASS_SOCKET_EVENTS.CLASS_JOINED, handleClassJoined)
    }
  }, [socket, isConnected])

  // Listen for new posts
  useEffect(() => {
    if (!socket || !isConnected || !classId) return

    const handlePostCreated = (data: PostCreatedResponse) => {
      console.log('🆕 [CLASS_SOCKET] New post received:', data)
      console.log(
        '🆕 [CLASS_SOCKET] Current classId:',
        classId,
        'Post class_id:',
        data.class_id,
      )

      // Only process if this post belongs to current class
      if (data.class_id !== classId) {
        console.log('🆕 [CLASS_SOCKET] Post is for different class, ignoring')
        return
      }

      // Skip if this is a reply (has parent_id)
      if (data.parent_id) {
        console.log('🆕 [CLASS_SOCKET] This is a reply, not a post, ignoring')
        return
      }

      // Note: Toast notification removed - handled by global useClassNotifications hook

      // Optimistically update cache with new post
      const queryKey = classKeys.detail(classId.toString())
      console.log('🆕 [CLASS_SOCKET] Updating query with key:', queryKey)

      queryClient.setQueryData<ClassDetailData>(queryKey, (oldData) => {
        if (!oldData) {
          console.log('🆕 [CLASS_SOCKET] No old data found in cache')
          return oldData
        }

        console.log(
          '🆕 [CLASS_SOCKET] Old posts count:',
          oldData.formattedPostData.length,
        )

        // Create new post object
        const newPost: PostCardProps = {
          id: data.id,
          sender: getUserInfo(data.sender_id),
          title: data.title || '',
          message: data.message,
          created_at: new Date(data.created_at),
          replies: [],
          materials: [],
        }

        // Check if post already exists (avoid duplicates)
        const postExists = oldData.formattedPostData.some(
          (p) => p.id === data.id,
        )
        if (postExists) {
          console.log('🆕 [CLASS_SOCKET] Post already exists, skipping')
          return oldData
        }

        console.log('🆕 [CLASS_SOCKET] Adding new post to cache')
        return {
          ...oldData,
          formattedPostData: [...oldData.formattedPostData, newPost],
        }
      })

      // Call custom callback if provided
      if (onPostCreated) {
        onPostCreated(data)
      }
    }

    socket.on(CLASS_SOCKET_EVENTS.POST_CREATED, handlePostCreated)

    return () => {
      socket.off(CLASS_SOCKET_EVENTS.POST_CREATED, handlePostCreated)
    }
  }, [
    socket,
    isConnected,
    classId,
    currentUser?.user_id,
    queryClient,
    onPostCreated,
    getUserInfo,
  ])

  // Listen for new replies
  useEffect(() => {
    if (!socket || !isConnected || !classId) return

    const handleReplyCreated = (data: ReplyCreatedResponse) => {
      console.log('💬 [CLASS_SOCKET] New reply received:', data)

      // Note: Toast notification removed - handled by global useClassNotifications hook

      // Optimistically update cache with new reply
      const queryKey = classKeys.detail(classId.toString())
      queryClient.setQueryData<ClassDetailData>(queryKey, (oldData) => {
        if (!oldData) return oldData

        // Create new reply object
        const newReply: PostCardProps = {
          id: data.id,
          sender: getUserInfo(data.sender_id),
          title: '',
          message: data.message,
          created_at: new Date(data.created_at),
          replies: [],
          materials: [],
        }

        // Find parent post and add reply to it
        const updatedPosts = oldData.formattedPostData.map((post) => {
          if (post.id === data.parent_id) {
            // Check if reply already exists (avoid duplicates)
            const replyExists = post.replies.some((r) => r.id === data.id)
            if (replyExists) {
              return post
            }
            return {
              ...post,
              replies: [...post.replies, newReply],
            }
          }
          return post
        })

        return {
          ...oldData,
          formattedPostData: updatedPosts,
        }
      })

      // Call custom callback if provided
      if (onReplyCreated) {
        onReplyCreated(data)
      }
    }

    socket.on(CLASS_SOCKET_EVENTS.REPLY_CREATED, handleReplyCreated)

    return () => {
      socket.off(CLASS_SOCKET_EVENTS.REPLY_CREATED, handleReplyCreated)
    }
  }, [
    socket,
    isConnected,
    classId,
    currentUser?.user_id,
    queryClient,
    onReplyCreated,
    getUserInfo,
  ])

  // Helper to send post via socket (optional - we're using REST API)
  const sendPost = useCallback(
    (title: string, message: string) => {
      if (!socket || !isConnected || !classId || !currentUser?.user_id) {
        console.warn('❌ [CLASS_SOCKET] Cannot send post - socket not ready')
        return
      }

      socket.emit(CLASS_SOCKET_EVENTS.CREATE_POST, {
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

      socket.emit(CLASS_SOCKET_EVENTS.CREATE_REPLY, {
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
