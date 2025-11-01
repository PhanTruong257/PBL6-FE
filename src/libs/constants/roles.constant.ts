import type { UserRole } from '@/types/user'

/**
 * User roles in the system.
 * @Match UserRole type: PBL6\apps\exams-service\prisma\schema.prisma
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

/**
 * Keys of USER_ROLES.
 */
export type UserRolesKey = keyof typeof USER_ROLES

/**
 * User roles type.
 */
export type UserRoles = (typeof USER_ROLES)[UserRolesKey]
