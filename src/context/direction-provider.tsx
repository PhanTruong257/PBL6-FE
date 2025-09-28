import { useEffect, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import type { Direction } from './contexts/direction-context'
import { 
  DirectionContext,
  DEFAULT_DIRECTION,
  DIRECTION_COOKIE_NAME,
  DIRECTION_COOKIE_MAX_AGE
} from './contexts/direction-context'

type DirectionProviderProps = {
  children: React.ReactNode
  defaultDir?: Direction
}

export function DirectionProvider({
  children,
  defaultDir = DEFAULT_DIRECTION,
}: DirectionProviderProps) {
  const [dir, setDirection] = useState<Direction>(() => {
    const dirCookie = getCookie(DIRECTION_COOKIE_NAME)
    if (dirCookie && (dirCookie === 'ltr' || dirCookie === 'rtl')) {
      return dirCookie
    }
    return defaultDir
  })

  useEffect(() => {
    document.documentElement.dir = dir
  }, [dir])

  const setDir = (dir: Direction) => {
    setDirection(dir)
    setCookie(DIRECTION_COOKIE_NAME, dir, DIRECTION_COOKIE_MAX_AGE)
  }

  const resetDir = () => {
    setDirection(defaultDir)
    removeCookie(DIRECTION_COOKIE_NAME)
  }

  const value = {
    defaultDir,
    dir,
    setDir,
    resetDir,
  }

  return (
    <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>
  )
}

