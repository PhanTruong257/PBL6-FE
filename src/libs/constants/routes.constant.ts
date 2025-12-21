import type { UserRole } from '@/types/user'

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

  // Admin routes
  ADMIN_MANAGE_USERS: '/admin/manage-users',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Default routes by role
 * All roles default to Classes page
 */
export const DEFAULT_ROUTES_BY_ROLE: Record<UserRole, RoutePath> = {
  admin: ROUTES.ADMIN_MANAGE_USERS,
  teacher: ROUTES.CLASSES,
  student: ROUTES.CLASSES,
  user: ROUTES.CLASSES,
} as const

export type DefaultRouteByRole = (typeof DEFAULT_ROUTES_BY_ROLE)[keyof typeof DEFAULT_ROUTES_BY_ROLE]
