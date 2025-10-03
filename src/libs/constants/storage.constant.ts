/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  // Auth
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',

  // Theme
  THEME: 'pbl6-ui-theme',

  // Settings
  LANGUAGE: 'app_language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',

  // Cache
  LAST_VISITED_PAGE: 'last_visited_page',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
