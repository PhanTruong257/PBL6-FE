/**
 * Session storage utilities for temporary data (password reset flow, etc.)
 */
export const sessionStorage = {
  /**
   * Set a value in sessionStorage
   * @param key Storage key
   * @param value Value to store
   */
  set: (key: string, value: string) => {
    window.sessionStorage.setItem(key, value)
  },

  /**
   * Get a value from sessionStorage
   * @param key Storage key
   * @returns Value or null if not found
   */
  get: (key: string): string | null => {
    return window.sessionStorage.getItem(key)
  },

  /**
   * Remove a value from sessionStorage
   * @param key Storage key
   */
  remove: (key: string) => {
    window.sessionStorage.removeItem(key)
  },

  /**
   * Clear all sessionStorage
   */
  clear: () => {
    window.sessionStorage.clear()
  },

  /**
   * Check if a key exists in sessionStorage
   * @param key Storage key
   * @returns true if key exists
   */
  has: (key: string): boolean => {
    return window.sessionStorage.getItem(key) !== null
  },

  /**
   * Set an object in sessionStorage (auto JSON stringify)
   * @param key Storage key
   * @param value Object to store
   */
  setObject: <T>(key: string, value: T) => {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },

  /**
   * Get an object from sessionStorage (auto JSON parse)
   * @param key Storage key
   * @returns Parsed object or null if not found/invalid
   */
  getObject: <T>(key: string): T | null => {
    const value = window.sessionStorage.getItem(key)
    if (!value) return null
    
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  },
}
