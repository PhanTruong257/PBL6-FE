import { atom, selector } from 'recoil'
import type { Socket } from 'socket.io-client'
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  PresenceStatus,
} from '@/features/conversation/types/socket-events'

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

/**
 * Socket instance state
 */
export const socketInstanceState = atom<TypedSocket | null>({
  key: 'socketInstanceState',
  default: null,
  dangerouslyAllowMutability: true, // Socket instances are not serializable
})

/**
 * Socket connection state
 */
export const socketConnectionState = atom<{
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
  reconnectAttempt: number
}>({
  key: 'socketConnectionState',
  default: {
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempt: 0,
  },
})

/**
 * User presence map
 */
export interface PresenceMap {
  [userId: number]: {
    status: PresenceStatus
    lastSeen?: string
  }
}

export const presenceMapState = atom<PresenceMap>({
  key: 'presenceMapState',
  default: {},
})

/**
 * Flag to track if presence has been initialized
 * Used to ensure we only set online once when socket connects
 */
export const presenceInitializedState = atom<boolean>({
  key: 'presenceInitializedState',
  default: false,
})

/**
 * Selector to check if socket is ready
 */
export const isSocketReadyState = selector({
  key: 'isSocketReadyState',
  get: ({ get }) => {
    const socket = get(socketInstanceState)
    const connection = get(socketConnectionState)
    return socket !== null && connection.isConnected
  },
})

/**
 * Selector to get user online status
 */
export const userOnlineStatusSelector = (userId: number) =>
  selector({
    key: `userOnlineStatus_${userId}`,
    get: ({ get }) => {
      const presenceMap = get(presenceMapState)
      return presenceMap[userId]?.status === 'online'
    },
  })
