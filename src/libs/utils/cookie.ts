import { STORAGE_KEYS } from '@/libs/constants/storage.constant'

/**
 * Cookie utilities for secure token storage
 * 
 * Note: For production, tokens should be set via httpOnly cookies from backend
 * This implementation uses client-side cookies for development
 * 
 * Security recommendations:
 * - Backend should set cookies with: httpOnly=true, secure=true, sameSite=strict
 * - Client should only read token existence, not values
 * - Use separate domain for API in production
 */

interface CookieOptions {
  days?: number
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  path?: string
}

/**
 * Set a cookie with security options
 * @param name Cookie name
 * @param value Cookie value
 * @param options Cookie options (days, secure, sameSite, path)
 */
function setCookie(name: string, value: string, options: CookieOptions = {}) {
  const {
    days = 7,
    secure = false, // Set to true in production with HTTPS
    sameSite = 'Lax',
    path = '/'
  } = options

  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  const secureFlag = secure ? '; Secure' : ''
  const sameSiteFlag = `; SameSite=${sameSite}`
  
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${path}${secureFlag}${sameSiteFlag}`
}

/**
 * Get cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
function getCookie(name: string): string | null {
  return document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, null as string | null)
}

/**
 * Delete a cookie by name
 * @param name Cookie name
 */
function deleteCookie(name: string, path = '/') {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}

/**
 * Check if a cookie exists
 * @param name Cookie name
 * @returns true if cookie exists
 */
function hasCookie(name: string): boolean {
  return getCookie(name) !== null
}

/**
 * Get all cookies as an object
 * @returns Object with cookie key-value pairs
 */
function getAllCookies(): Record<string, string> {
  return document.cookie.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=')
    if (key && value) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>)
}

/**
 * Token storage using cookies
 * For production: Backend should set httpOnly cookies
 */
export const cookieStorage = {
  /**
   * Get access token from cookie
   */
  getAccessToken: (): string | null => {
    return getCookie(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * Get refresh token from cookie
   */
  getRefreshToken: (): string | null => {
    return getCookie(STORAGE_KEYS.REFRESH_TOKEN)
  },

  /**
   * Set both access and refresh tokens
   * @param accessToken Access token value
   * @param refreshToken Refresh token value
   */
  setTokens: (accessToken: string, refreshToken: string) => {
    // Access token: 7 days
    setCookie(STORAGE_KEYS.ACCESS_TOKEN, accessToken, {
      days: 7,
      secure: false, // TODO: Set to true in production
      sameSite: 'Lax',
    })

    // Refresh token: 30 days
    setCookie(STORAGE_KEYS.REFRESH_TOKEN, refreshToken, {
      days: 30,
      secure: false, // TODO: Set to true in production
      sameSite: 'Lax',
    })
  },

  /**
   * Clear all authentication tokens
   */
  clearTokens: () => {
    deleteCookie(STORAGE_KEYS.ACCESS_TOKEN)
    deleteCookie(STORAGE_KEYS.REFRESH_TOKEN)
    deleteCookie(STORAGE_KEYS.USER)
  },

  /**
   * Check if user is authenticated (has access token)
   */
  isAuthenticated: (): boolean => {
    return hasCookie(STORAGE_KEYS.ACCESS_TOKEN)
  },

  /**
   * Store user data in cookie.
   * Better approach: Store user ID only and fetch from API
   */
  setUser: <T>(user: T) => {
    setCookie(STORAGE_KEYS.USER, JSON.stringify(user), {
      days: 7,
      secure: false,
      sameSite: 'Lax',
    })
  },

  /**
   * Get user data from cookie
   */
  getUser: <T>(): T | null => {
    const userStr = getCookie(STORAGE_KEYS.USER)
    if (!userStr) return null
    
    try {
      return JSON.parse(userStr) as T
    } catch {
      return null
    }
  },

  /**
   * Remove user data from cookie
   */
  removeUser: () => {
    deleteCookie(STORAGE_KEYS.USER)
  },
}

// Export individual functions for advanced use cases
export { setCookie, getCookie, deleteCookie, hasCookie, getAllCookies }
