import { httpClient } from '@/libs/http'
import type {
  Role,
  Permission,
  RolePermissionDto,
  CreateRoleDto,
  CreatePermissionDto,
  UpdateRoleDto,
} from '../types'
import type { IApiResponse } from '@/types'

/**
 * Permissions Service - API calls for role and permission management
 */
export const PermissionsService = {
  /**
   * Get all roles with their permissions
   */
  async getAllRoles(): Promise<Role[]> {
    const response = await httpClient.get<IApiResponse<{ roles: Role[] }>>('/users/admin/roles')
    console.log('API Response - getAllRoles full:', response.data)
    return response.data.data.roles
  },

  /**
   * Get all available permissions
   */
  async getAllPermissions(): Promise<Permission[]> {
    const response = await httpClient.get<IApiResponse<{ permissions: Permission[] }>>(
      '/users/admin/permissions'
    )
    return response.data.data.permissions
  },

  /**
   * Assign permissions to a role
   */
  async assignPermissionsToRole(roleName: string, permissionKeys: string[]): Promise<void> {
    await httpClient.post('/users/admin/roles/assign-permissions', {
      roleName,
      permissionNames: permissionKeys,
    })
  },

  /**
   * Helper to convert role and permission IDs to names for API
   */
  prepareAssignPayload(
    roleName: string,
    allPermissions: Permission[],
    selectedPermissionIds: number[]
  ): RolePermissionDto {
    const permissionNames = allPermissions
      .filter((p) => selectedPermissionIds.includes(p.permission_id))
      .map((p) => p.key)
    
    return {
      roleName,
      permissionNames,
    }
  },

  /**
   * Create a new role
   */
  async createRole(data: CreateRoleDto): Promise<Role> {
    const response = await httpClient.post<IApiResponse<Role>>('/users/admin/roles/create', data)
    return response.data.data
  },

  /**
   * Update a role
   */
  async updateRole(roleId: number, data: UpdateRoleDto): Promise<Role> {
    const response = await httpClient.put<IApiResponse<Role>>(
      `/users/admin/roles/${roleId}`,
      data
    )
    return response.data.data
  },

  /**
   * Create a new permission
   */
  async createPermission(data: CreatePermissionDto): Promise<Permission> {
    const response = await httpClient.post<IApiResponse<Permission>>(
      '/users/admin/permissions/create',
      data
    )
    return response.data.data
  },

  /**
   * Delete a role (only if it has no users assigned)
   */
  async deleteRole(roleId: number): Promise<void> {
    await httpClient.delete(`/users/admin/roles/${roleId}`)
  },
}
