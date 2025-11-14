import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PermissionsService } from '../apis'
import type { CreatePermissionDto, CreateRoleDto, Permission, UpdateRoleDto } from '../types'
import { toast } from '@/libs/toast'

const QUERY_KEYS = {
  ROLES: ['permissions', 'roles'],
  PERMISSIONS: ['permissions', 'list'],
}

export function useRoles() {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn: () => PermissionsService.getAllRoles(),
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: QUERY_KEYS.PERMISSIONS,
    queryFn: () => PermissionsService.getAllPermissions(),
  })
}

export function useAssignPermissions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      roleName,
      permissionIds,
      allPermissions,
    }: {
      roleName: string
      permissionIds: number[]
      allPermissions: Permission[]
    }) => {
      const permissionKeys = allPermissions
        .filter((p) => permissionIds.includes(p.permission_id))
        .map((p) => p.key)

      return PermissionsService.assignPermissionsToRole(roleName, permissionKeys)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES })
      toast.success('Phân quyền thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Phân quyền thất bại')
    },
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleDto) => PermissionsService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES })
      toast.success('Tạo vai trò thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Tạo vai trò thất bại')
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: UpdateRoleDto }) =>
      PermissionsService.updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES })
      toast.success('Cập nhật vai trò thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Cập nhật vai trò thất bại')
    },
  })
}

export function useCreatePermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePermissionDto) => PermissionsService.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PERMISSIONS })
      toast.success('Tạo quyền hạn thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Tạo quyền hạn thất bại')
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleId: number) => PermissionsService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES })
      toast.success('Xóa vai trò thành công')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Xóa vai trò thất bại')
    },
  })
}
