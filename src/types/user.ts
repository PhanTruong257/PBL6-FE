export type UserRole = 'admin' | 'teacher' | 'student'

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  role: UserRole
  status: UserStatus
  isEmailVerified: boolean
  phone?: string
  dateOfBirth?: string
  address?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends User {
  // Additional profile fields
  enrolledCourses?: number
  completedCourses?: number
  points?: number
}

export interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  address?: string
  bio?: string
  avatar?: string
}
