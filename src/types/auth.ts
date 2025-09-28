export type UserRole = 'admin' | 'teacher' | 'student'

export const USER_ROLE = {
  ADMIN: 'admin' as UserRole,
  TEACHER: 'teacher' as UserRole,
  STUDENT: 'student' as UserRole,
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  phone?: string
  bio?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: Exclude<UserRole, 'admin'> // Admins cannot register through the normal flow
}