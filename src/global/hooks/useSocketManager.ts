import { useEffect, useCallback } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { io } from 'socket.io-client'
import {
  socketInstanceState,
  socketConnectionState,
  type TypedSocket,
} from '@/global/recoil/socket'
import { currentUserState } from '@/global/recoil/user'

interface UseSocketManagerOptions {
  url: string
  autoConnect?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
}

/**
 * Hook to manage Socket.IO connection with Recoil
 */
export function useSocketManager(options: UseSocketManagerOptions) {
  const {
    url,
    autoConnect = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 1000,
  } = options

  const currentUser = useRecoilValue(currentUserState)
  const setSocket = useSetRecoilState(socketInstanceState)
  const setConnectionState = useSetRecoilState(socketConnectionState)

  const connect = useCallback(() => {
    if (!currentUser?.user_id) {
      console.log('🔌 [SOCKET] No user logged in, skipping connection')
      return null
    }

    const userId = currentUser.user_id

    console.log('🔌 [SOCKET] Connecting to Socket.IO...')
    console.log('   URL:', url)
    console.log('   User ID:', userId)

    setConnectionState((prev) => ({ ...prev, isConnecting: true, error: null }))

    const socket = io(url, {
      query: { userId: userId.toString() },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts,
      reconnectionDelay,
      timeout: 10000,
      autoConnect: true,
    }) as TypedSocket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ [SOCKET] Connected:', socket.id)
      setConnectionState({
        isConnected: true,
        isConnecting: false,
        error: null,
        reconnectAttempt: 0,
      })
    })

    socket.on('disconnect', (reason: string) => {
      console.log('❌ [SOCKET] Disconnected:', reason)
      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
      }))
    })

    socket.on('connect_error', (error: Error) => {
      console.error('❌ [SOCKET] Connection error:', error)
      setConnectionState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error,
      }))
    })

    socket.io.on('reconnect_attempt', (attempt: number) => {
      console.log(
        `🔄 [SOCKET] Reconnection attempt ${attempt}/${reconnectionAttempts}`,
      )
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: true,
        reconnectAttempt: attempt,
      }))
    })

    socket.io.on('reconnect_failed', () => {
      console.error('❌ [SOCKET] Reconnection failed')
      setConnectionState((prev) => ({
        ...prev,
        isConnecting: false,
        error: new Error('Failed to reconnect after multiple attempts'),
      }))
    })

    socket.io.on('reconnect', (attempt: number) => {
      console.log(`✅ [SOCKET] Reconnected after ${attempt} attempts`)
      setConnectionState({
        isConnected: true,
        isConnecting: false,
        error: null,
        reconnectAttempt: 0,
      })
    })

    setSocket(socket)
    return socket
  }, [
    currentUser?.user_id,
    url,
    reconnectionAttempts,
    reconnectionDelay,
    setSocket,
    setConnectionState,
  ])

  const disconnect = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket) {
        console.log('🔌 [SOCKET] Disconnecting...')
        currentSocket.disconnect()
      }
      return null
    })
    setConnectionState({
      isConnected: false,
      isConnecting: false,
      error: null,
      reconnectAttempt: 0,
    })
  }, [setSocket, setConnectionState])

  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(() => connect(), 100)
  }, [connect, disconnect])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && currentUser?.user_id) {
      const socket = connect()

      return () => {
        if (socket) {
          console.log('🔌 [SOCKET] Cleaning up connection')
          socket.disconnect()
          setSocket(null)
          setConnectionState({
            isConnected: false,
            isConnecting: false,
            error: null,
            reconnectAttempt: 0,
          })
        }
      }
    }
  }, [autoConnect, currentUser?.user_id])

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setSocket((currentSocket) => {
        if (
          document.visibilityState === 'visible' &&
          currentSocket &&
          !currentSocket.connected
        ) {
          console.log('🔄 [SOCKET] Tab visible, reconnecting...')
          reconnect()
        }
        return currentSocket
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [reconnect, setSocket])

  return {
    connect,
    disconnect,
    reconnect,
  }
}
