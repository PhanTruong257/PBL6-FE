export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  USER: 'user',
} as const

/**
 * Keys of USER_ROLES.
 */
export type UserRolesKey = keyof typeof USER_ROLES

/**
 * User roles type.
 */
export type UserRoles = (typeof USER_ROLES)[UserRolesKey]

/**
 * Navigation roles for sidebar (3 roles only)
 * Admin, Teacher, Student - 'user' maps to 'student'
 */
export type NavigationRole = 'admin' | 'teacher' | 'student'

/**
 * Map backend role to navigation role for sidebar
 * @param role - Role from backend API
 * @returns Navigation role for sidebar filtering
 */
export function getNavigationRole(role: string): NavigationRole {
  const mapping: Record<string, NavigationRole> = {
    [USER_ROLES.ADMIN]: 'admin',
    [USER_ROLES.TEACHER]: 'teacher',
    [USER_ROLES.STUDENT]: 'student',
    [USER_ROLES.USER]: 'student',
  }
  return mapping[role]
}
