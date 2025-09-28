export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_COURSES: 'manage_courses',
  MANAGE_TEACHERS: 'manage_teachers',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  
  // Teacher permissions
  CREATE_COURSE: 'create_course',
  EDIT_COURSE: 'edit_course',
  MANAGE_LESSONS: 'manage_lessons',
  MANAGE_ASSIGNMENTS: 'manage_assignments',
  VIEW_STUDENTS: 'view_students',
  
  // Student permissions
  ENROLL_COURSE: 'enroll_course',
  ACCESS_COURSE: 'access_course',
  SUBMIT_ASSIGNMENT: 'submit_assignment',
  VIEW_PROGRESS: 'view_progress',
} as const

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.MANAGE_TEACHERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_SETTINGS,
  ],
  [USER_ROLES.TEACHER]: [
    PERMISSIONS.CREATE_COURSE,
    PERMISSIONS.EDIT_COURSE,
    PERMISSIONS.MANAGE_LESSONS,
    PERMISSIONS.MANAGE_ASSIGNMENTS,
    PERMISSIONS.VIEW_STUDENTS,
  ],
  [USER_ROLES.STUDENT]: [
    PERMISSIONS.ENROLL_COURSE,
    PERMISSIONS.ACCESS_COURSE,
    PERMISSIONS.SUBMIT_ASSIGNMENT,
    PERMISSIONS.VIEW_PROGRESS,
  ],
}