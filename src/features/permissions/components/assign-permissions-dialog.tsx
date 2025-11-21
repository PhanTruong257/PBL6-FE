import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAssignPermissions } from '../hooks'
import type { Role, Permission } from '../types'

interface AssignPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  allPermissions: Permission[]
}

export function AssignPermissionsDialog({
  open,
  onOpenChange,
  role,
  allPermissions,
}: AssignPermissionsDialogProps) {
  const { mutateAsync: assignPermissions, isPending } = useAssignPermissions()
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])

  // Initialize selected permissions when role changes
  useEffect(() => {
    if (role?.permissions) {
      setSelectedPermissionIds(role.permissions.map((p) => p.permission_id))
    } else {
      setSelectedPermissionIds([])
    }
  }, [role])

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSubmit = async () => {
    if (!role) return

    try {
      await assignPermissions({
        roleName: role.name,
        permissionIds: selectedPermissionIds,
        allPermissions,
      })
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
    }
  }

  if (!role) return null

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce(
    (acc, permission) => {
      const resource = permission.resource || 'other'
      if (!(resource in acc)) {
        acc[resource] = []
      }
      acc[resource].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Phân quyền cho vai trò: {role.name}</DialogTitle>
          <DialogDescription>
            Chọn các quyền hạn muốn gán cho vai trò này
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedPermissions).map(([resource, permissions]) => (
              <div key={resource}>
                <h4 className="font-semibold text-sm mb-3 capitalize">{resource}</h4>
                <div className="space-y-3">
                  {permissions.map((permission) => (
                    <div key={permission.permission_id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`permission-${permission.permission_id}`}
                        checked={selectedPermissionIds.includes(permission.permission_id)}
                        onCheckedChange={() => handleTogglePermission(permission.permission_id)}
                      />
                      <div className="grid gap-1 leading-none">
                        <label
                          htmlFor={`permission-${permission.permission_id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-muted-foreground">
                          {permission.key} - {permission.action}
                        </p>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
