import { type ReactNode } from 'react'
import { useSocketManager, useSocket } from '../hooks'

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
  // Initialize socket connection
  useSocketManager({
    url: SOCKET_URL,
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return <>{children}</>
}
