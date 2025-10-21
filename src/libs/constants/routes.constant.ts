/**
 * Application route paths
 * Unified routing structure with role-based rendering
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_CODE: '/auth/verify-code',
  
  // Unified routes (role-based rendering)
  DASHBOARD: '/dashboard',
  CLASSES: '/classes',
  CREATE_CLASS: '/classes/create-class',
  
  // Shared routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_APPEARANCE: '/settings/appearance',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_DISPLAY: '/settings/display',
  
  NOTIFICATIONS: '/notifications',
  
  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Default routes by role
 * Admin or Teacher -> Classes page
 * Student/User -> Dashboard
 */
export const DEFAULT_ROUTES_BY_ROLE = {
  admin: ROUTES.CLASSES,
  teacher: ROUTES.CLASSES,
  user: ROUTES.DASHBOARD,
} as const

export type DefaultRouteByRole = (typeof DEFAULT_ROUTES_BY_ROLE)[keyof typeof DEFAULT_ROUTES_BY_ROLE]
