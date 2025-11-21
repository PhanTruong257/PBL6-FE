import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Shield, Key, Settings, Edit, Eye, Trash2 } from 'lucide-react'
import { useRoles, usePermissions, useDeleteRole } from '../hooks'
import {
  CreateRoleDialog,
  EditRoleDialog,
  CreatePermissionDialog,
  RoleDetailDialog,
  EditRolePermissionsDialog,
  DeleteRoleDialog,
} from '../components'
import type { Role } from '../types'

export function RolePermissionsPage() {
  const [createRoleOpen, setCreateRoleOpen] = useState(false)
  const [editRoleOpen, setEditRoleOpen] = useState(false)
  const [createPermissionOpen, setCreatePermissionOpen] = useState(false)
  const [roleDetailOpen, setRoleDetailOpen] = useState(false)
  const [editPermissionsOpen, setEditPermissionsOpen] = useState(false)
  const [deleteRoleOpen, setDeleteRoleOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const { data: roles, isLoading: rolesLoading } = useRoles()
  const { data: permissions, isLoading: permissionsLoading } = usePermissions()
  const { mutateAsync: deleteRole, isPending: isDeleting } = useDeleteRole()

  // Debug: Log roles data để kiểm tra userRoles
  console.log('Roles data:', roles)

  const handleViewRole = (role: Role) => {
    setSelectedRole(role)
    setRoleDetailOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setEditRoleOpen(true)
  }

  const handleEditPermissions = (role: Role) => {
    setSelectedRole(role)
    setEditPermissionsOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setSelectedRole(role)
    setDeleteRoleOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedRole) return

    try {
      await deleteRole(selectedRole.role_id)
      setDeleteRoleOpen(false)
      setSelectedRole(null)
    } catch (error) {}
  }

  if (rolesLoading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Quản lý Vai trò & Quyền hạn
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý vai trò và phân quyền cho người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số vai trò</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số quyền</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quyền được gán</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles?.reduce((sum, role) => sum + (role.permissions?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vai trò trong hệ thống</CardTitle>
              <CardDescription>Danh sách các vai trò và quyền hạn của từng vai trò</CardDescription>
            </div>
            <Button onClick={() => setCreateRoleOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo vai trò mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên vai trò</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số quyền</TableHead>
                <TableHead>Số người dùng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((role) => (
                <TableRow key={role.role_id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {role.description || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{role.permissions?.length || 0} quyền</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={(role.userRoles?.length || 0) > 0 ? "default" : "outline"}>
                      {role.userRoles?.length || 0} người
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewRole(role)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEditPermissions(role)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa quyền
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRole(role)}
                        disabled={(role.userRoles?.length || 0) > 0}
                        title={(role.userRoles?.length || 0) > 0 ? "Không thể xóa role đang có người dùng" : ""}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permissions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách quyền hạn</CardTitle>
              <CardDescription>Tất cả các quyền hạn có sẵn trong hệ thống</CardDescription>
            </div>
            <Button onClick={() => setCreatePermissionOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo quyền mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Tên quyền</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Mô tả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions?.map((permission) => (
                <TableRow key={permission.permission_id}>
                  <TableCell className="font-mono text-xs bg-muted/50 rounded">
                    {permission.key}
                  </TableCell>
                  <TableCell className="font-medium">{permission.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{permission.resource}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{permission.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {permission.description || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateRoleDialog open={createRoleOpen} onOpenChange={setCreateRoleOpen} />
      <CreatePermissionDialog
        open={createPermissionOpen}
        onOpenChange={setCreatePermissionOpen}
      />
      <RoleDetailDialog
        open={roleDetailOpen}
        onOpenChange={setRoleDetailOpen}
        role={selectedRole}
        allPermissions={permissions || []}
      />
      <EditRoleDialog
        open={editRoleOpen}
        onOpenChange={setEditRoleOpen}
        role={selectedRole}
      />
      <EditRolePermissionsDialog
        open={editPermissionsOpen}
        onOpenChange={setEditPermissionsOpen}
        role={selectedRole}
        allPermissions={permissions || []}
      />
      <DeleteRoleDialog
        open={deleteRoleOpen}
        onOpenChange={setDeleteRoleOpen}
        role={selectedRole}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
