import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Loader2, ChevronDown, ChevronRight } from 'lucide-react'
import { useAssignPermissions } from '../hooks'
import { toast } from '@/libs/toast'
import type { Role, Permission } from '../types'

interface EditRolePermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  allPermissions: Permission[]
}

export function EditRolePermissionsDialog({
  open,
  onOpenChange,
  role,
  allPermissions,
}: EditRolePermissionsDialogProps) {
  const { mutateAsync: assignPermissions, isPending } = useAssignPermissions()
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [initialPermissionIds, setInitialPermissionIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set())

  // Initialize selected permissions when role changes
  useEffect(() => {
    if (role?.permissions) {
      const permissionIds = role.permissions.map((p) => p.permission_id)
      setSelectedPermissionIds(permissionIds)
      setInitialPermissionIds(permissionIds)
    } else {
      setSelectedPermissionIds([])
      setInitialPermissionIds([])
    }
    setSearchQuery('')
  }, [role])

  const hasChanges = () => {
    if (selectedPermissionIds.length !== initialPermissionIds.length) return true
    return !selectedPermissionIds.every((id) => initialPermissionIds.includes(id))
  }

  const handleClose = () => {
    if (hasChanges()) {
      setShowCancelDialog(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleSave = () => {
    if (!hasChanges()) {
      toast.info('Không có thay đổi nào để lưu')
      return
    }
    setShowConfirmDialog(true)
  }

  const handleConfirmSave = async () => {
    if (!role) return

    try {
      await assignPermissions({
        roleName: role.name,
        permissionIds: selectedPermissionIds,
        allPermissions,
      })
      setShowConfirmDialog(false)
      onOpenChange(false)
    } catch (error) {
      // Error handled by mutation
      setShowConfirmDialog(false)
    }
  }

  const handleCancelChanges = () => {
    setSelectedPermissionIds(initialPermissionIds)
    setShowCancelDialog(false)
    onOpenChange(false)
  }

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSelectAll = (_resource: string, permissions: Permission[]) => {
    const resourcePermissionIds = permissions.map((p) => p.permission_id)
    const allSelected = resourcePermissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    )

    if (allSelected) {
      setSelectedPermissionIds((prev) =>
        prev.filter((id) => !resourcePermissionIds.includes(id))
      )
    } else {
      setSelectedPermissionIds((prev) => [
        ...prev.filter((id) => !resourcePermissionIds.includes(id)),
        ...resourcePermissionIds,
      ])
    }
  }

  const toggleResource = (resource: string) => {
    setExpandedResources((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(resource)) {
        newSet.delete(resource)
      } else {
        newSet.add(resource)
      }
      return newSet
    })
  }

  if (!role) return null

  // Filter permissions based on search
  const filteredPermissions = allPermissions.filter((permission) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      permission.name.toLowerCase().includes(query) ||
      permission.key.toLowerCase().includes(query) ||
      permission.resource.toLowerCase().includes(query) ||
      permission.action.toLowerCase().includes(query) ||
      permission.description?.toLowerCase().includes(query)
    )
  })

  // Group permissions by resource
  const groupedPermissions = filteredPermissions.reduce(
    (acc, permission) => {
      const resource = permission.resource || 'other'
      if (!acc[resource]) {
        acc[resource] = []
      }
      acc[resource].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>
  )

  const addedCount = selectedPermissionIds.filter(
    (id) => !initialPermissionIds.includes(id)
  ).length
  const removedCount = initialPermissionIds.filter(
    (id) => !selectedPermissionIds.includes(id)
  ).length

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Chỉnh sửa quyền: <span className="text-primary">{role.name}</span>
            </DialogTitle>
            <DialogDescription>
              Chọn các quyền hạn muốn gán cho vai trò này. Các thay đổi sẽ được lưu sau khi bạn
              nhấn nút "Lưu thay đổi".
            </DialogDescription>
          </DialogHeader>

          {/* Summary */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Đã chọn:</span>
              <Badge variant="secondary">{selectedPermissionIds.length} quyền</Badge>
            </div>
            {hasChanges() && (
              <>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Thay đổi:</span>
                  {addedCount > 0 && (
                    <Badge variant="default" className="bg-green-600">
                      +{addedCount}
                    </Badge>
                  )}
                  {removedCount > 0 && (
                    <Badge variant="destructive">-{removedCount}</Badge>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm quyền theo tên, key, resource, action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Permissions List */}
          <ScrollArea className="h-[450px] pr-4">
            <div className="space-y-4">
              {Object.keys(groupedPermissions).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Không tìm thấy quyền nào phù hợp với tìm kiếm của bạn
                </p>
              ) : (
                Object.entries(groupedPermissions).map(([resource, permissions]) => {
                  const allSelected = permissions.every((p) =>
                    selectedPermissionIds.includes(p.permission_id)
                  )
                  const isExpanded = expandedResources.has(resource)
                  const selectedCount = permissions.filter((p) =>
                    selectedPermissionIds.includes(p.permission_id)
                  ).length

                  return (
                    <div key={resource} className="space-y-2 border rounded-lg overflow-hidden">
                      {/* Resource Header - Collapsible */}
                      <div className="bg-muted/30">
                        <div className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-3 flex-1">
                            <button
                              onClick={() => toggleResource(resource)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <Checkbox
                              id={`resource-${resource}`}
                              checked={allSelected}
                              onCheckedChange={() => handleSelectAll(resource, permissions)}
                            />
                            <label
                              htmlFor={`resource-${resource}`}
                              className="font-semibold text-sm capitalize cursor-pointer flex items-center gap-2 flex-1"
                              onClick={() => toggleResource(resource)}
                            >
                              <Badge variant="outline">{resource}</Badge>
                              <span className="text-muted-foreground font-normal">
                                ({permissions.length} quyền)
                              </span>
                            </label>
                          </div>
                          <Badge variant={selectedCount > 0 ? 'default' : 'secondary'}>
                            {selectedCount} / {permissions.length}
                          </Badge>
                        </div>
                      </div>

                      {/* Permissions in Resource */}
                      {isExpanded && (
                        <div className="space-y-2 p-3 pt-0">
                          {permissions.map((permission) => (
                            <div
                              key={permission.permission_id}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border"
                            >
                              <Checkbox
                                id={`permission-${permission.permission_id}`}
                                checked={selectedPermissionIds.includes(permission.permission_id)}
                                onCheckedChange={() =>
                                  handleTogglePermission(permission.permission_id)
                                }
                              />
                              <div className="grid gap-1 leading-none flex-1">
                                <label
                                  htmlFor={`permission-${permission.permission_id}`}
                                  className="text-sm font-medium leading-none cursor-pointer flex items-center justify-between"
                                >
                                  <span>{permission.name}</span>
                                  <Badge className="ml-2">{permission.action}</Badge>
                                </label>
                                <p className="text-xs font-mono text-muted-foreground">
                                  {permission.key}
                                </p>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isPending || !hasChanges()}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu thay đổi'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Save Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận lưu thay đổi</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                Bạn đang thay đổi quyền hạn cho vai trò <strong>{role.name}</strong>.
                <div className="mt-3 space-y-1">
                  {addedCount > 0 && (
                    <div className="text-green-600">
                      • Thêm <strong>{addedCount}</strong> quyền mới
                    </div>
                  )}
                  {removedCount > 0 && (
                    <div className="text-red-600">
                      • Xóa <strong>{removedCount}</strong> quyền
                    </div>
                  )}
                </div>
                <div className="mt-3">Bạn có chắc chắn muốn lưu các thay đổi này không?</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSave} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Xác nhận'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc muốn hủy?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có những thay đổi chưa được lưu. Nếu bạn đóng hộp thoại này, tất cả các thay đổi
              sẽ bị mất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Tiếp tục chỉnh sửa
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelChanges} className="bg-destructive">
              Hủy thay đổi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
