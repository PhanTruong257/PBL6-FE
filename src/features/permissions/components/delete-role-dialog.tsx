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
import type { Role } from '../types'

interface DeleteRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  role,
  onConfirm,
  isDeleting,
}: DeleteRoleDialogProps) {
  if (!role) return null

  const hasUsers = (role.userRoles?.length || 0) > 0
  const permissionsCount = (role.permissions?.length || 0)

  console.log('DeleteRoleDialog - role.userRoles:', role.userRoles)
  console.log('DeleteRoleDialog - hasUsers:', hasUsers)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
          <AlertDialogDescription>
            {hasUsers ? (
              <div className="space-y-3">
                <p className="text-destructive font-medium">
                  Không thể xóa vai trò "{role.name}"
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="font-medium text-destructive mb-2">
                    ⚠️ Có {role.userRoles?.length} người dùng đang có vai trò này:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {role.userRoles?.slice(0, 5).map((userRole) => (
                      <li key={userRole.user_role_id}>
                        {userRole.user.full_name} ({userRole.user.email})
                      </li>
                    ))}
                    {(role.userRoles?.length || 0) > 5 && (
                      <li className="text-muted-foreground">
                        ... và {(role.userRoles?.length || 0) - 5} người khác
                      </li>
                    )}
                  </ul>
                  <p className="mt-2 text-sm">
                    Vui lòng gỡ vai trò này khỏi tất cả người dùng trước khi xóa.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  Bạn có chắc chắn muốn xóa vai trò <strong>"{role.name}"</strong>?
                </p>
                {permissionsCount > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <p className="text-sm text-amber-800">
                      ℹ️ Vai trò này có <strong>{permissionsCount} quyền</strong> được gán. 
                      Các quyền này sẽ tự động bị xóa khỏi vai trò.
                    </p>
                  </div>
                )}
                <p className="text-muted-foreground text-sm">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
          {!hasUsers && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa vai trò'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
