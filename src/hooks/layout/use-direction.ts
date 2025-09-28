import { useContext } from 'react'
import { DirectionContext } from '@/context/contexts/direction-context'

export function useDirection() {
  const context = useContext(DirectionContext)
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider')
  }
  return context
}