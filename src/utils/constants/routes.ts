export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:id',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_TEACHERS: '/admin/teachers',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Teacher routes
  TEACHER_DASHBOARD: '/teacher',
  TEACHER_COURSES: '/teacher/courses',
  TEACHER_LESSONS: '/teacher/lessons',
  TEACHER_ASSIGNMENTS: '/teacher/assignments',
  TEACHER_STUDENTS: '/teacher/students',
  
  // Student routes
  STUDENT_DASHBOARD: '/student',
  STUDENT_COURSES: '/student/courses',
  STUDENT_LEARNING: '/student/learning',
  STUDENT_PROGRESS: '/student/progress',
  
  // Shared routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  NOT_FOUND: '/404',
} as const

export type RouteKey = keyof typeof ROUTES
export type RouteValue = typeof ROUTES[RouteKey]