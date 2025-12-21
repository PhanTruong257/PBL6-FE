export * from './roles.constant'

export * from './routes.constant'

export * from './storage.constant'

export * from './sidebar-navigation.constant'

export * from './permissions.constant'

/**
 * Application-wide constants
 */
export const APP_CONFIG = {
  NAME: 'PBL6 LMS',
  VERSION: '1.0.0',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  ITEMS_PER_PAGE: 10,
  REQUEST_TIMEOUT: 30000,
} as const

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/,
} as const
