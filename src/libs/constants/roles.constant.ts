import type { UserRole } from '@/types/user'

/**
 * User roles in the system
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

/**
 * Permissions for each role
 */
export const ROLE_PERMISSIONS = {
  admin: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'courses.view',
    'courses.create',
    'courses.edit',
    'courses.delete',
    'settings.manage',
    'reports.view',
  ],
  teacher: [
    'courses.view',
    'courses.create',
    'courses.edit',
    'my-courses.manage',
    'students.view',
    'assignments.create',
    'assignments.grade',
    'attendance.manage',
  ],
  student: [
    'courses.view',
    'courses.enroll',
    'assignments.view',
    'assignments.submit',
    'grades.view',
    'profile.edit',
  ],
} as const

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number]
