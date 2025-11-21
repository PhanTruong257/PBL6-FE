import { type ReactNode, useEffect } from 'react'
import { useSocketManager } from '@/global/hooks/useSocketManager'
import { usePresence } from '@/global/hooks/usePresence'
import { useSocket } from '@/global/hooks/useSocket'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000/chat'

interface GlobalSocketProviderProps {
  children: ReactNode
}

/**
 * Global Socket Provider - Uses Recoil for state management
 * Connects Socket.IO after login and manages real-time updates
 */
export function GlobalSocketProvider({ children }: GlobalSocketProviderProps) {
  const { socket, isConnected } = useSocket()

  // Initialize socket connection
  useSocketManager({
    url: SOCKET_URL,
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  // Initialize presence management
  usePresence()

  // Listen for global notifications
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleMessageReceived = (data: any) => {
      console.log('🔔 [GLOBAL_SOCKET] New message notification:', data)
    }

    const handleMessageStatus = (data: any) => {
      console.log('✅ [GLOBAL_SOCKET] Message status updated:', data)
    }

    const handleUserOnline = (data: any) => {
      console.log('✅ [GLOBAL_SOCKET] User online:', data)
    }

    const handleUserOffline = (data: any) => {
      console.log('❌ [GLOBAL_SOCKET] User offline:', data)
    }

    socket.on('message:received', handleMessageReceived)
    socket.on('message:status', handleMessageStatus)
    socket.on('user:online', handleUserOnline)
    socket.on('user:offline', handleUserOffline)

    return () => {
      socket.off('message:received', handleMessageReceived)
      socket.off('message:status', handleMessageStatus)
      socket.off('user:online', handleUserOnline)
      socket.off('user:offline', handleUserOffline)
    }
  }, [socket, isConnected])

  return <>{children}</>
}

/**
 * Hook to access global socket - now just re-exports useSocket
 * @deprecated Use useSocket from @/global/hooks instead
 */
export function useGlobalSocket() {
  return useSocket()
}
