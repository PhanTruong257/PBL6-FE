import { useEffect, useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  socketInstanceState,
  presenceMapState,
  presenceInitializedState,
} from '@/global/recoil/socket'
import { currentUserState } from '@/global/recoil/user'
import {
  SOCKET_EVENTS,
  PresenceStatus,
  type UserPresenceResponse,
  type RequestPresencePayload,
} from '@/features/conversation/types/socket-events'

/**
 * Hook to manage user presence with Recoil
 */
export function usePresence() {
  const socket = useRecoilValue(socketInstanceState)
  const currentUser = useRecoilValue(currentUserState)
  const [presenceMap, setPresenceMap] = useRecoilState(presenceMapState)
  const [presenceInitialized, setPresenceInitialized] = useRecoilState(
    presenceInitializedState,
  )

  const userId = currentUser?.user_id

  /**
   * Request presence for specific users
   */
  const requestPresence = useCallback(
    (userIds: number[]) => {
      if (!socket?.connected || userIds.length === 0) return

      const payload: RequestPresencePayload = { user_ids: userIds }
      socket.emit(SOCKET_EVENTS.REQUEST_PRESENCE, payload)
    },
    [socket],
  )

  /**
   * Update local presence status
   */
  const updatePresence = useCallback(
    (status: PresenceStatus) => {
      if (!socket?.connected || !userId) return

      socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
        user_id: userId,
        status,
        last_seen: new Date().toISOString(),
      })
    },
    [socket, userId],
  )

  /**
   * Check if user is online
   */
  const isUserOnline = useCallback(
    (targetUserId: number) => {
      return presenceMap[targetUserId]?.status === PresenceStatus.ONLINE
    },
    [presenceMap],
  )

  /**
   * Handle presence updates from server
   */
  useEffect(() => {
    if (!socket) return

    const handleUserOnline = (data: UserPresenceResponse) => {
      setPresenceMap((prev) => ({
        ...prev,
        [data.user_id]: {
          status: PresenceStatus.ONLINE,
          lastSeen: data.last_seen,
        },
      }))
    }

    const handleUserOffline = (data: UserPresenceResponse) => {
      setPresenceMap((prev) => ({
        ...prev,
        [data.user_id]: {
          status: PresenceStatus.OFFLINE,
          lastSeen: data.last_seen,
        },
      }))
    }

    const handleUserPresence = (data: UserPresenceResponse) => {
      setPresenceMap((prev) => ({
        ...prev,
        [data.user_id]: {
          status: data.status,
          lastSeen: data.last_seen,
        },
      }))
    }

    const handlePresenceList = (data: UserPresenceResponse[]) => {
      const newPresenceMap: typeof presenceMap = {}
      data.forEach((presence) => {
        newPresenceMap[presence.user_id] = {
          status: presence.status,
          lastSeen: presence.last_seen,
        }
      })
      setPresenceMap((prev) => ({ ...prev, ...newPresenceMap }))
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
  }, [socket, setPresenceMap])

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
   * Set online when socket connects, offline on disconnect/unmount
   */
  useEffect(() => {
    if (!socket || !userId) {
      setPresenceInitialized(false)
      return
    }

    // Set online immediately if already connected and not yet initialized
    if (socket.connected && !presenceInitialized) {
      updatePresence(PresenceStatus.ONLINE)
      setPresenceInitialized(true)
    }

    // Listen for connect event and set online
    const handleConnect = () => {
      if (!presenceInitialized) {
        updatePresence(PresenceStatus.ONLINE)
        setPresenceInitialized(true)
      }
    }

    const handleDisconnect = (reason: string) => {
      setPresenceInitialized(false)
      // Don't manually set offline here - backend will handle it
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)

      // DON'T set offline on component unmount
      // User is still logged in, just navigating to different tab
      // Offline will be set when socket disconnects (logout/close app)
    }
  }, [
    socket,
    userId,
    updatePresence,
    presenceInitialized,
    setPresenceInitialized,
  ])

  /**
   * Set offline when user closes/refreshes the page
   */
  useEffect(() => {
    if (!socket || !userId) return

    const handleBeforeUnload = () => {
      if (socket.connected) {
        socket.emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
          user_id: userId,
          status: PresenceStatus.OFFLINE,
          last_seen: new Date().toISOString(),
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [socket, userId])

  return {
    presenceMap,
    requestPresence,
    updatePresence,
    isUserOnline,
  }
}
