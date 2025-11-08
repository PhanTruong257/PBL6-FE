import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket-events'

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export interface SocketManagerOptions {
    url: string
    userId: number
    autoConnect?: boolean
    reconnectionAttempts?: number
    reconnectionDelay?: number
}

export interface SocketManagerState {
    isConnected: boolean
    isConnecting: boolean
    error: Error | null
    reconnectAttempt: number
}

/**
 * Hook for managing Socket.IO connection with type safety
 * Handles connection, reconnection, and cleanup
 */
export function useSocketManager(options: SocketManagerOptions) {
    const {
        url,
        userId,
        autoConnect = true,
        reconnectionAttempts = 5,
        reconnectionDelay = 1000,
    } = options

    const socketRef = useRef<TypedSocket | null>(null)
    const [state, setState] = useState<SocketManagerState>({
        isConnected: false,
        isConnecting: false,
        error: null,
        reconnectAttempt: 0,
    })

    /**
     * Connect to socket server
     */
    const connect = useCallback(() => {
        if (socketRef.current?.connected) {
            return socketRef.current
        }

        console.log('🔌 [SOCKET_MANAGER] Connecting to Socket.IO server...')
        console.log('   URL:', url)
        console.log('   User ID:', userId)

        setState(prev => ({ ...prev, isConnecting: true, error: null }))

        const socket = io(url, {
            query: { userId: userId.toString() },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts,
            reconnectionDelay,
            timeout: 10000,
            autoConnect: true,
        }) as TypedSocket

        console.log('   Transports:', ['websocket', 'polling'])
        console.log('   Query params:', { userId: userId.toString() })

        // Connection event handlers
        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id)
            setState({
                isConnected: true,
                isConnecting: false,
                error: null,
                reconnectAttempt: 0,
            })
        })

        socket.on('disconnect', (reason: string) => {
            console.log('❌ Socket disconnected:', reason)
            setState(prev => ({
                ...prev,
                isConnected: false,
                isConnecting: false,
            }))
        })

        socket.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error)
            setState(prev => ({
                ...prev,
                isConnected: false,
                isConnecting: false,
                error,
            }))
        })

        socket.io.on('reconnect_attempt', (attempt: number) => {
            console.log(`🔄 Reconnection attempt ${attempt}/${reconnectionAttempts}`)
            setState(prev => ({
                ...prev,
                isConnecting: true,
                reconnectAttempt: attempt,
            }))
        })

        socket.io.on('reconnect_failed', () => {
            console.error('❌ Reconnection failed')
            setState(prev => ({
                ...prev,
                isConnecting: false,
                error: new Error('Failed to reconnect after multiple attempts'),
            }))
        })

        socket.io.on('reconnect', (attempt: number) => {
            console.log(`✅ Reconnected after ${attempt} attempts`)
            setState({
                isConnected: true,
                isConnecting: false,
                error: null,
                reconnectAttempt: 0,
            })
        })

        socketRef.current = socket
        return socket
    }, [url, userId, reconnectionAttempts, reconnectionDelay])

    /**
     * Disconnect from socket server
     */
    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect()
            socketRef.current = null
        }
    }, [])

    /**
     * Manually reconnect
     */
    const reconnect = useCallback(() => {
        disconnect()
        connect()
    }, [connect, disconnect])

    /**
     * Initialize connection
     */
    useEffect(() => {
        if (autoConnect) {
            connect()
        }

        // Cleanup on unmount
        return () => {
            disconnect()
        }
    }, [autoConnect, connect, disconnect])

    /**
     * Handle visibility change - reconnect when tab becomes active
     */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !socketRef.current?.connected) {
                console.log('🔄 Tab visible, reconnecting...')
                reconnect()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [reconnect])

    return {
        socket: socketRef.current,
        ...state,
        connect,
        disconnect,
        reconnect,
    }
}
