import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { Permission } from '../types'

interface GroupedPermissions {
  [resource: string]: Permission[]
}

interface PermissionTreeProps {
  allPermissions: Permission[]
  selectedPermissionIds: number[]
  onSelectionChange?: (permissionIds: number[]) => void
  readOnly?: boolean
}

export function PermissionTree({
  allPermissions,
  selectedPermissionIds,
  onSelectionChange,
  readOnly = false,
}: PermissionTreeProps) {
  // Mở tất cả resources mặc định
  const allResources = Array.from(new Set(allPermissions.map(p => p.resource || 'other')))
  const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set(allResources))

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce<GroupedPermissions>((acc, permission) => {
    const resource = permission.resource || 'other'
    if (!(resource in acc)) {
      acc[resource] = []
    }
    acc[resource].push(permission)
    return acc
  }, {})

  const toggleResource = (resource: string) => {
    const newExpanded = new Set(expandedResources)
    if (newExpanded.has(resource)) {
      newExpanded.delete(resource)
    } else {
      newExpanded.add(resource)
    }
    setExpandedResources(newExpanded)
  }

  const handlePermissionToggle = (permissionId: number) => {
    if (readOnly || !onSelectionChange) return

    const newSelection = selectedPermissionIds.includes(permissionId)
      ? selectedPermissionIds.filter((id) => id !== permissionId)
      : [...selectedPermissionIds, permissionId]

    onSelectionChange(newSelection)
  }

  const handleResourceToggle = (_resource: string, permissions: Permission[]) => {
    if (readOnly || !onSelectionChange) return

    const resourcePermissionIds = permissions.map((p) => p.permission_id)
    const allSelected = resourcePermissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    )

    let newSelection: number[]
    if (allSelected) {
      // Unselect all permissions in this resource
      newSelection = selectedPermissionIds.filter((id) => !resourcePermissionIds.includes(id))
    } else {
      // Select all permissions in this resource
      const idsToAdd = resourcePermissionIds.filter((id) => !selectedPermissionIds.includes(id))
      newSelection = [...selectedPermissionIds, ...idsToAdd]
    }

    onSelectionChange(newSelection)
  }

  const isResourceFullySelected = (permissions: Permission[]) => {
    return permissions.every((p) => selectedPermissionIds.includes(p.permission_id))
  }

  // Sort resources alphabetically
  const sortedResources = Object.keys(groupedPermissions).sort()

  return (
    <div className="space-y-4">
      {sortedResources.map((resource) => {
        const permissions = groupedPermissions[resource]
        const isExpanded = expandedResources.has(resource)
        const fullySelected = isResourceFullySelected(permissions)
        const selectedCount = selectedPermissionIds.filter((id) =>
          permissions.some((p) => p.permission_id === id)
        ).length

        return (
          <div key={resource} className="space-y-2">
            {/* Resource Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleResource(resource)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {!readOnly && (
                  <Checkbox
                    id={`resource-${resource}`}
                    checked={fullySelected}
                    onCheckedChange={() => handleResourceToggle(resource, permissions)}
                  />
                )}
                <label
                  htmlFor={`resource-${resource}`}
                  className="font-semibold text-sm capitalize cursor-pointer flex items-center gap-2"
                  onClick={() => toggleResource(resource)}
                >
                  <Badge variant="outline">{resource}</Badge>
                  <span className="text-muted-foreground font-normal">
                    ({permissions.length} quyền)
                  </span>
                  {!readOnly && (
                    <span className="text-xs text-muted-foreground">
                      - {selectedCount} được chọn
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Permissions List */}
            {isExpanded && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                {permissions.map((permission) => {
                  const isSelected = selectedPermissionIds.includes(permission.permission_id)

                  // Nếu readOnly và không được chọn thì không hiển thị
                  if (readOnly && !isSelected) return null

                  return (
                    <div
                      key={permission.permission_id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <Checkbox
                        id={`permission-${permission.permission_id}`}
                        checked={isSelected}
                        onCheckedChange={() => !readOnly && handlePermissionToggle(permission.permission_id)}
                        disabled={readOnly}
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
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
