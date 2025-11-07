import { useEffect, useState, useCallback } from 'react'
import {
    SOCKET_EVENTS,
    PresenceStatus,
    type UserPresenceResponse,
    type RequestPresencePayload,
} from '../types/socket-events'
import type { TypedSocket } from './useSocketManager'

export interface PresenceMap {
    [userId: number]: {
        status: PresenceStatus
        lastSeen?: string
    }
}

interface UsePresenceOptions {
    socket: TypedSocket | null
    userId: number
}

/**
 * Hook for managing user presence (online/offline status)
 */
export function usePresence(options: UsePresenceOptions) {
    const { socket, userId } = options

    const [presenceMap, setPresenceMap] = useState<PresenceMap>({})

    /**
     * Request presence for specific users
     */
    const requestPresence = useCallback(
        (userIds: number[]) => {
            if (!socket?.connected || userIds.length === 0) return

            const payload: RequestPresencePayload = { user_ids: userIds }
            socket.emit(SOCKET_EVENTS.REQUEST_PRESENCE, payload)
        },
        [socket]
    )

    /**
     * Update local presence status
     */
    const updatePresence = useCallback(
        (status: PresenceStatus) => {
            if (!socket?.connected) return

            socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
                user_id: userId,
                status,
                last_seen: new Date().toISOString(),
            })
        },
        [socket, userId]
    )

    /**
     * Get presence for a specific user
     */
    const getPresence = useCallback(
        (targetUserId: number) => {
            return presenceMap[targetUserId] || { status: PresenceStatus.OFFLINE }
        },
        [presenceMap]
    )

    /**
     * Check if user is online
     */
    const isUserOnline = useCallback(
        (targetUserId: number) => {
            return presenceMap[targetUserId]?.status === PresenceStatus.ONLINE
        },
        [presenceMap]
    )

    /**
     * Handle presence updates from server
     */
    useEffect(() => {
        if (!socket) return

        const handleUserOnline = (data: UserPresenceResponse) => {
            setPresenceMap(prev => ({
                ...prev,
                [data.user_id]: {
                    status: PresenceStatus.ONLINE,
                    lastSeen: data.last_seen,
                },
            }))
        }

        const handleUserOffline = (data: UserPresenceResponse) => {
            setPresenceMap(prev => ({
                ...prev,
                [data.user_id]: {
                    status: PresenceStatus.OFFLINE,
                    lastSeen: data.last_seen,
                },
            }))
        }

        const handleUserPresence = (data: UserPresenceResponse) => {
            setPresenceMap(prev => ({
                ...prev,
                [data.user_id]: {
                    status: data.status,
                    lastSeen: data.last_seen,
                },
            }))
        }

        const handlePresenceList = (data: UserPresenceResponse[]) => {
            const newPresenceMap: PresenceMap = {}
            data.forEach(presence => {
                newPresenceMap[presence.user_id] = {
                    status: presence.status,
                    lastSeen: presence.last_seen,
                }
            })
            setPresenceMap(prev => ({ ...prev, ...newPresenceMap }))
        }

        socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline)
        socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline)
        socket.on(SOCKET_EVENTS.USER_PRESENCE, handleUserPresence)
        socket.on(SOCKET_EVENTS.PRESENCE_LIST, handlePresenceList)

        return () => {
            socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline)
            socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline)
            socket.off(SOCKET_EVENTS.USER_PRESENCE, handleUserPresence)
            socket.off(SOCKET_EVENTS.PRESENCE_LIST, handlePresenceList)
        }
    }, [socket])

    /**
     * Handle visibility change - update presence
     */
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                updatePresence(PresenceStatus.ONLINE)
            } else {
                updatePresence(PresenceStatus.AWAY)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [updatePresence])

    /**
     * Set online on mount, offline on unmount
     */
    useEffect(() => {
        if (socket?.connected) {
            updatePresence(PresenceStatus.ONLINE)
        }

        return () => {
            if (socket?.connected) {
                updatePresence(PresenceStatus.OFFLINE)
            }
        }
    }, [socket, updatePresence])

    return {
        presenceMap,
        requestPresence,
        updatePresence,
        getPresence,
        isUserOnline,
    }
}
