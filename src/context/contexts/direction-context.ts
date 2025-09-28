import { createContext } from 'react'

export type Direction = 'ltr' | 'rtl'

export const DEFAULT_DIRECTION = 'ltr'
export const DIRECTION_COOKIE_NAME = 'dir'
export const DIRECTION_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

export const DirectionContext = createContext<DirectionContextType | null>(null)