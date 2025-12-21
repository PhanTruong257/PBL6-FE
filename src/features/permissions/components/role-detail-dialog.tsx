import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { Role, Permission } from '../types'

interface RoleDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  allPermissions: Permission[]
}

export function RoleDetailDialog({ open, onOpenChange, role }: RoleDetailDialogProps) {
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set())
  
  if (!role) return null

  // Group only granted permissions by resource
  const groupedPermissions = (role.permissions || []).reduce(
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Chi tiết vai trò</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về vai trò và các quyền hạn được gán
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Information */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Tên vai trò</label>
              <p className="text-lg font-semibold mt-1">{role.displayText || role.name}</p>
            </div>
            
            {role.description && (
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Mô tả</label>
                <p className="text-sm mt-1">{role.description}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Tổng số quyền</label>
              <p className="text-lg font-semibold mt-1">
                <Badge variant="secondary" className="text-base">
                  {role.permissions?.length || 0} quyền
                </Badge>
              </p>
            </div>
          </div>

          <Separator />

          {/* Permissions List */}
          <div>
            <h4 className="font-semibold mb-3">Danh sách quyền hạn</h4>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {Object.keys(groupedPermissions).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Vai trò này chưa được gán quyền nào
                  </p>
                ) : (
                  Object.entries(groupedPermissions).map(([resource, permissions]) => {
                    const isExpanded = expandedResources.has(resource)

                    return (
                      <div key={resource} className="space-y-2 border rounded-lg overflow-hidden">
                        {/* Resource Header - Collapsible */}
                        <div className="bg-muted/30">
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleResource(resource)}
                          >
                            <div className="flex items-center gap-3">
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <span className="font-semibold text-sm capitalize">
                                <Badge variant="outline">{resource}</Badge>
                              </span>
                            </div>
                            <Badge variant="secondary">
                              {permissions.length} quyền
                            </Badge>
                          </div>
                        </div>

                        {/* Permissions in Resource */}
                        {isExpanded && (
                          <div className="space-y-2 p-3 pt-0">
                            {permissions.map((permission) => (
                              <div
                                key={permission.permission_id}
                                className="p-3 rounded-lg bg-muted/30 space-y-1 border"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm">{permission.name}</span>
                                  <Badge className="text-xs">{permission.action}</Badge>
                                </div>
                                <p className="text-xs font-mono text-muted-foreground">
                                  {permission.key}
                                </p>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
