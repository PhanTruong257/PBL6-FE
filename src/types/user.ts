export type UserRole = 'admin' | 'teacher' | 'user'

export type UserStatus = 'active' | 'block'

export interface Permission {
  permission_id: number
  key: string
  name: string
  resource: string
  action: string
  description?: string
}

export interface Role {
  role_id: number
  name: string
  description?: string
}

export interface User {
  user_id: number
  email: string
  gender?: string
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
  roles?: Role[]
  permissions?: Permission[]
}
