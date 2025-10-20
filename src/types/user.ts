export type UserRole = 'admin' | 'teacher' | 'user'

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface User {
  user_id: number
  full_name: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  avatar?: string
  role: UserRole
  status: UserStatus
  created_at: string
  updated_at?: string
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
  phone?: string
  dateOfBirth?: string
  address?: string
  avatar?: string
}
