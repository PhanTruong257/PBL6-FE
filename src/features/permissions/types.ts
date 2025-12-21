export interface Permission {
  permission_id: number
  key: string
  name: string
  resource: string
  action: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface UserRoleInfo {
  user_role_id: number
  user_id: number
  role_id: number
  user: {
    user_id: number
    full_name: string
    email: string
  }
}

export interface Role {
  role_id: number
  name: string
  displayText?: string
  description?: string
  created_at?: string
  updated_at?: string
  permissions?: Permission[]
  userRoles?: UserRoleInfo[]
}

export interface RolePermissionDto {
  roleName: string
  permissionNames: string[]
}

export interface CreateRoleDto {
  name: string
  displayText: string
  description?: string
}

export interface CreatePermissionDto {
  key: string
  name: string
  resource: string
  action: string
  description?: string
}

export interface UpdateRoleDto {
  displayText?: string
  description?: string
}
