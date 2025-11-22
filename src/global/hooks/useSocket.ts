import { useRecoilValue } from 'recoil'
import {
  socketInstanceState,
  socketConnectionState,
  isSocketReadyState,
} from '@/global/recoil/socket'

/**
 * Hook to access socket instance and connection state
 */
export function useSocket() {
  const socket = useRecoilValue(socketInstanceState)
  const connectionState = useRecoilValue(socketConnectionState)
  const isReady = useRecoilValue(isSocketReadyState)

  return {
    socket,
    ...connectionState,
    isReady,
  }
}
