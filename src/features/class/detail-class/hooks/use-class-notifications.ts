import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { useSocket, useAllUsers } from '@/global/hooks'
import { CLASS_SOCKET_EVENTS } from '@/features/conversation/types/socket-events'
import type {
  PostCreatedResponse,
  ReplyCreatedResponse,
} from '@/features/conversation/types/socket-events'
import type { User } from '@/types'
import { ClassService } from '../../api/class-service'

interface ClassNotificationOptions {
  userId: number | undefined
  userRole?: string
  enabled?: boolean
}

/**
 * Hook to show browser notifications for class activities (posts, replies)
 * Displays popup toast notifications that navigate to class on click
 * Mount at root level to listen globally across all routes
 *
 * This hook automatically joins ALL classes the user belongs to
 * so they receive notifications even when not on the class detail page
 */
export function useClassNotifications({
  userId,
  userRole,
  enabled = true,
}: ClassNotificationOptions) {
  const { socket, isConnected } = useSocket()
  const router = useRouter()
  const { users: allUsers } = useAllUsers()
  const joinedClassesRef = useRef<Set<number>>(new Set())
  const classNamesRef = useRef<Map<number, string>>(new Map())

  // Fetch user's classes based on role
  const { data: classesData } = useQuery({
    queryKey: ['user-classes', userId, userRole],
    queryFn: async () => {
      if (!userId) return null

      // Determine which API to call based on role
      if (userRole === 'teacher' || userRole === 'admin') {
        return ClassService.GetClassesByTeacher(userId)
      } else {
        return ClassService.GetClassesByStudent(userId)
      }
    },
    enabled: enabled && !!userId && !!userRole,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

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

  // Helper function to get user info
  const getUserInfo = useCallback(
    (senderId: number): User => {
      const user = allUsers.find((u) => u.user_id === senderId)
      return (
        user || {
          ...defaultUser,
          user_id: senderId,
          email: `user${senderId}@gmail.com`,
        }
      )
    },
    [allUsers],
  )

  // Join all user's classes to receive global notifications
  useEffect(() => {
    if (!socket || !isConnected || !userId || !classesData) {
      return
    }

    const classes = classesData.data

    // Join each class room and store class names
    classes.forEach((classItem: any) => {
      const classId = classItem.class_id
      const className = classItem.class_name || 'Lớp học'

      // Store class name for notifications
      classNamesRef.current.set(classId, className)

      // Skip if already joined
      if (joinedClassesRef.current.has(classId)) {
        return
      }

      socket.emit(CLASS_SOCKET_EVENTS.JOIN_CLASS, {
        class_id: classId,
        user_id: userId,
      })

      joinedClassesRef.current.add(classId)
    })

    // Cleanup: leave all classes on unmount
    return () => {
      joinedClassesRef.current.forEach((classId) => {
        socket.emit(CLASS_SOCKET_EVENTS.LEAVE_CLASS, {
          class_id: classId,
        })
      })
      joinedClassesRef.current.clear()
    }
  }, [socket, isConnected, userId, classesData])

  // Request notification permission on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [enabled])

  const showPostNotification = useCallback(
    (post: PostCreatedResponse) => {
      // Don't show notification for own posts
      if (post.sender_id === userId) {
        return
      }

      // Skip replies (they have parent_id)
      if (post.parent_id) {
        return
      }

      // Don't show notification if user is already on that class page
      const currentPath = window.location.pathname
      const currentSearch = window.location.search
      if (
        currentPath.includes('/classes/detail-class') &&
        currentSearch.includes(`id=${post.class_id}`)
      ) {
        return
      }

      // Get sender name and class name
      const sender = getUserInfo(post.sender_id)
      const senderName = sender.full_name || sender.email || 'Người dùng'
      const className = classNamesRef.current.get(post.class_id) || 'Lớp học'

      const content = post.title || post.message.substring(0, 100)

      // Show toast notification with click action
      const toastId = toast('📚 Bài viết mới', {
        description: `${className} • ${senderName}: ${content}`,
        duration: 5000,
        action: {
          label: 'Xem',
          onClick: () => {
            router.navigate({
              to: '/classes/detail-class',
              search: { id: post.class_id },
              hash: 'scroll-to-bottom',
            })
            toast.dismiss(toastId)
          },
        },
      })

      // Show browser notification
      if (
        'Notification' in window &&
        Notification.permission === 'granted' &&
        !currentPath.includes('/classes/detail-class')
      ) {
        const notification = new Notification('📚 Bài viết mới', {
          body: `${className} • ${senderName}: ${content}`,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: `class-post-${post.class_id}`,
        })

        notification.onclick = () => {
          window.focus()
          router.navigate({
            to: '/classes/detail-class',
            search: { id: post.class_id },
            hash: 'scroll-to-bottom',
          })
          notification.close()
        }
      }
    },
    [userId, router, getUserInfo],
  )

  const showReplyNotification = useCallback(
    (reply: ReplyCreatedResponse) => {
      // Don't show notification for own replies
      if (reply.sender_id === userId) {
        return
      }

      // Don't show notification if user is already on that class page
      const currentPath = window.location.pathname
      const currentSearch = window.location.search
      if (
        currentPath.includes('/classes/detail-class') &&
        currentSearch.includes(`id=${reply.class_id}`)
      ) {
        return
      }

      // Get sender name and class name
      const sender = getUserInfo(reply.sender_id)
      const senderName = sender.full_name || sender.email || 'Người dùng'
      const className = classNamesRef.current.get(reply.class_id) || 'Lớp học'

      const content = reply.message.substring(0, 100)

      // Show toast notification with click action
      const toastId = toast('💬 Trả lời mới', {
        description: `${className} • ${senderName}: ${content}`,
        duration: 5000,
        action: {
          label: 'Xem',
          onClick: () => {
            router.navigate({
              to: '/classes/detail-class',
              search: { id: reply.class_id },
              hash: 'scroll-to-bottom',
            })
            toast.dismiss(toastId)
          },
        },
      })

      // Show browser notification
      if (
        'Notification' in window &&
        Notification.permission === 'granted' &&
        !currentPath.includes('/classes/detail-class')
      ) {
        const notification = new Notification('💬 Trả lời mới', {
          body: `${className} • ${senderName}: ${content}`,
          icon: '/logo.png',
          badge: '/logo.png',
          tag: `class-reply-${reply.class_id}`,
        })

        notification.onclick = () => {
          window.focus()
          router.navigate({
            to: '/classes/detail-class',
            search: { id: reply.class_id },
            hash: 'scroll-to-bottom',
          })
          notification.close()
        }
      }
    },
    [userId, router, getUserInfo],
  )

  useEffect(() => {
    if (!socket || !userId || !enabled) {
      return
    }

    const handleClassJoined = () => {}

    const handlePostCreated = (post: PostCreatedResponse) => {
      showPostNotification(post)
    }

    const handleReplyCreated = (reply: ReplyCreatedResponse) => {
      showReplyNotification(reply)
    }

    socket.on(CLASS_SOCKET_EVENTS.CLASS_JOINED, handleClassJoined)
    socket.on(CLASS_SOCKET_EVENTS.POST_CREATED, handlePostCreated)
    socket.on(CLASS_SOCKET_EVENTS.REPLY_CREATED, handleReplyCreated)

    return () => {
      socket.off(CLASS_SOCKET_EVENTS.CLASS_JOINED, handleClassJoined)
      socket.off(CLASS_SOCKET_EVENTS.POST_CREATED, handlePostCreated)
      socket.off(CLASS_SOCKET_EVENTS.REPLY_CREATED, handleReplyCreated)
    }
  }, [socket, userId, enabled, showPostNotification, showReplyNotification])
}
