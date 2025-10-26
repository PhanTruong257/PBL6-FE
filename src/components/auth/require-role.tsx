import { type ReactNode, useState } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useRoleGuard } from '@/hooks/use-role-guard'
import { DEFAULT_ROUTES_BY_ROLE } from '@/libs/constants/routes.constant'
import type { UserRole } from '@/types/user'
import { Loader2, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface RequireRoleProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  requiredPermissions?: string[]
  redirectTo?: string
  showAccessDenied?: boolean
}

/**
 * Component wrapper that requires specific roles or permissions
 * Redirects to role-based home or shows access denied if unauthorized
 */
export function RequireRole({
  children,
  allowedRoles,
  requiredPermissions,
  redirectTo,
  showAccessDenied = false,
}: RequireRoleProps) {
  const [isUnauthorized, setIsUnauthorized] = useState(false)
  
  const { isAuthenticated, isChecking, user } = useRoleGuard({
    allowedRoles,
    requiredPermissions,
    redirectTo: showAccessDenied ? undefined : redirectTo,
    onUnauthorized: showAccessDenied ? () => setIsUnauthorized(true) : undefined,
  })

  // Show loading spinner while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If not authenticated, don't render (let RequireAuth handle it)
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" />
  }

  // Show access denied page if unauthorized and showAccessDenied is true
  if (isUnauthorized && showAccessDenied) {
    const destination = redirectTo || DEFAULT_ROUTES_BY_ROLE[user.role]
    return <AccessDeniedPage homePath={destination} />
  }

  // Render children if authorized
  return <>{children}</>
}

/**
 * Access Denied page shown when user doesn't have required permissions
 */
function AccessDeniedPage({ homePath }: { homePath: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Truy cập bị từ chối</CardTitle>
          <CardDescription>
            Bạn không có quyền truy cập trang này
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên hệ thống.
          </p>
          <Button asChild className="w-full">
            <a href={homePath}>Quay về trang chủ</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
