/**
 * Application route paths
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
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Teacher routes
  TEACHER: '/teacher',
  TEACHER_DASHBOARD: '/teacher/dashboard',
  TEACHER_MY_COURSES: '/teacher/my-courses',
  TEACHER_CREATE_COURSE: '/teacher/create-course',
  TEACHER_USERS: '/teacher/users',
  
  // user routes
  USER: '/user',
  USER_DASHBOARD: '/user/dashboard',
  USER_COURSES: '/user/courses',
  USER_LEARNING: '/user/learning',
  USER_ASSIGNMENTS: '/user/assignments',
  
  // Shared routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  
  // Error routes
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/**
 * Default routes by role
 */
export const DEFAULT_ROUTES_BY_ROLE = {
  admin: ROUTES.ADMIN_DASHBOARD,
  teacher: ROUTES.TEACHER_DASHBOARD,
  user: ROUTES.USER_DASHBOARD,
} as const
