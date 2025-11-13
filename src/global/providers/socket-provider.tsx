import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRecoilValue } from 'recoil'
import { io, Socket } from 'socket.io-client'
import { currentUserState } from '@/global/recoil/user'

interface ServerToClientEvents {
    'message:received': (data: any) => void
    'message:sent': (data: any) => void
    'message:status': (data: any) => void
    'message:error': (data: any) => void
    'messages:read': (data: any) => void
    'user:online': (data: any) => void
    'user:offline': (data: any) => void
    'user:typing': (data: any) => void
    'user:presence': (data: any) => void
    'conversation:joined': (data: any) => void
    'presence:list': (data: any) => void
    'error': (data: any) => void
    'reconnected': (data: any) => void
    // Post events
    'post:created': (data: any) => void
    'reply:created': (data: any) => void
    'class:joined': (data: any) => void
}

interface ClientToServerEvents {
    'message:send': (data: any) => void
    'message:delivered': (data: any) => void
    'message:read': (data: any) => void
    'conversation:join': (data: any) => void
    'conversation:leave': (data: any) => void
    'typing:start': (data: any) => void
    'typing:stop': (data: any) => void
    'presence:update': (data: any) => void
    'presence:request': (data: any) => void
    // Post events
    'class:join': (data: any) => void
    'class:leave': (data: any) => void
    'post:create': (data: any) => void
    'reply:create': (data: any) => void
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface SocketContextValue {
    socket: TypedSocket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextValue>({
    socket: null,
    isConnected: false,
})

interface GlobalSocketProviderProps {
    children: ReactNode
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000/chat'

/**
 * Global Socket Provider - Kết nối Socket.IO ngay sau khi login
 * Dùng để nhận notifications và real-time updates ở mọi trang
 */
export function GlobalSocketProvider({ children }: GlobalSocketProviderProps) {
    const currentUser = useRecoilValue(currentUserState)
    const [socket, setSocket] = useState<TypedSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Chỉ kết nối khi user đã login
        if (!currentUser?.user_id) {
            console.log('🔌 [GLOBAL_SOCKET] No user logged in, skipping connection')
            return
        }

        const userId = currentUser.user_id

        console.log('🔌 [GLOBAL_SOCKET] Connecting to Socket.IO...')
        console.log('   URL:', SOCKET_URL)
        console.log('   User ID:', userId)

        const newSocket = io(SOCKET_URL, {
            query: { userId: userId.toString() },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            autoConnect: true,
        }) as TypedSocket

        // Connection events
        newSocket.on('connect', () => {
            console.log('✅ [GLOBAL_SOCKET] Connected:', newSocket.id)
            setIsConnected(true)
        })

        newSocket.on('disconnect', (reason: string) => {
            console.log('❌ [GLOBAL_SOCKET] Disconnected:', reason)
            setIsConnected(false)
        })

        newSocket.on('connect_error', (error: Error) => {
            console.error('❌ [GLOBAL_SOCKET] Connection error:', error)
        })

        // Listen for global notifications
        newSocket.on('message:received', (data) => {
            console.log('🔔 [GLOBAL_SOCKET] New message notification:', data)
            // Notification will be handled by specific hooks (useUnreadCount, useUnreadByConversation)
        })

        newSocket.on('message:status', (data) => {
            console.log('✅ [GLOBAL_SOCKET] Message status updated:', data)
            // Status updates will be handled by specific hooks
        })

        newSocket.on('messages:read', (data) => {
            console.log('📖 [GLOBAL_SOCKET] Messages marked as read:', data)
            // Read status updates will be handled by specific hooks
        })

        newSocket.on('user:online', (data) => {
            console.log('✅ [GLOBAL_SOCKET] User online:', data)
        })

        newSocket.on('user:offline', (data) => {
            console.log('❌ [GLOBAL_SOCKET] User offline:', data)
        })

        setSocket(newSocket)

        // Cleanup on unmount or user change
        return () => {
            console.log('🔌 [GLOBAL_SOCKET] Cleaning up connection')
            newSocket.disconnect()
            setSocket(null)
            setIsConnected(false)
        }
    }, [currentUser?.user_id])

    const value = useMemo(
        () => ({
            socket,
            isConnected,
        }),
        [socket, isConnected]
    )

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

/**
 * Hook để access global socket
 */
export function useGlobalSocket() {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useGlobalSocket must be used within GlobalSocketProvider')
    }
    return context
}
