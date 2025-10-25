import type { User } from '@/types'

export interface ExtendedUser extends User {
  teacher_id?: string
  department?: string
  specialization?: string
  qualification?: string
  experience_years?: number
  bio?: string
  courses_taught?: number
  rating?: number
  is_verified?: boolean
}

export interface UserFilters {
  search?: string
  text?: string
  status?: string
  role?: string
  gender?: string
  birthday?: string
  sortBy?: 'name' | 'email' | 'created_at' | 'rating'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface CreateUserRequest {
  full_name: string
  email: string
  phone?: string
  role: string
  department?: string
  specialization?: string
  qualification?: string
  experience_years?: number
  password: string
}

export interface UpdateUserRequest {
  full_name?: string
  phone?: string
  department?: string
  specialization?: string
  qualification?: string
  experience_years?: number
  bio?: string
  status?: string
}

// Legacy types for backward compatibility
export interface Teacher extends ExtendedUser {
  teacher_id: string
}

export interface TeacherFilters extends UserFilters {}

export interface CreateTeacherRequest extends CreateUserRequest {}

export interface UpdateTeacherRequest extends UpdateUserRequest {}

export interface UserResponse {
  data: {
    users: User[]
    total: number
    limit: number
  }
  success: boolean
  message?: string

}

export interface UserFilters {
  text?: string
  status?: string
  role?: string
  gender?: string
  birthday?: string
  sortBy?: 'name' | 'email' | 'created_at' | 'rating'
  sortOrder?: 'asc' | 'desc',
  page?: number,
  limit?: number,
}