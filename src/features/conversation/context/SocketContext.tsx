import React, { createContext, useContext, useMemo } from 'react'
import { useSocketManager, type SocketManagerState } from '../hooks/useSocketManager'
import { usePresence, type PresenceMap } from '../hooks/usePresence'
import type { TypedSocket } from '../hooks/useSocketManager'
import { PresenceStatus } from '../types/socket-events'

interface SocketContextValue {
    socket: TypedSocket | null
    socketState: SocketManagerState
    presenceMap: PresenceMap
    isUserOnline: (userId: number) => boolean
    requestPresence: (userIds: number[]) => void
    updatePresence: (status: PresenceStatus) => void
    reconnect: () => void
}

const SocketContext = createContext<SocketContextValue | null>(null)

interface SocketProviderProps {
    children: React.ReactNode
    url: string
    userId: number
}

/**
 * Socket.IO Provider Component
 * Provides socket connection and presence management to all children
 */
export function SocketProvider({ children, url, userId }: SocketProviderProps) {
    // Manage socket connection
    const {
        socket,
        isConnected,
        isConnecting,
        error,
        reconnectAttempt,
        reconnect,
    } = useSocketManager({
        url,
        userId,
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    })

    // Manage user presence
    const {
        presenceMap,
        isUserOnline,
        requestPresence,
        updatePresence,
    } = usePresence({
        socket,
        userId,
    })

    const value = useMemo(
        () => ({
            socket,
            socketState: {
                isConnected,
                isConnecting,
                error,
                reconnectAttempt,
            },
            presenceMap,
            isUserOnline,
            requestPresence,
            updatePresence,
            reconnect,
        }),
        [
            socket,
            isConnected,
            isConnecting,
            error,
            reconnectAttempt,
            presenceMap,
            isUserOnline,
            requestPresence,
            updatePresence,
            reconnect,
        ]
    )

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

/**
 * Hook to use socket context
 */
export function useSocket() {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider')
    }
    return context
}
