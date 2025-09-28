import { Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store'
import type { UserRole } from '@/utils/constants/roles'
import { ROUTES } from '@/utils/constants/routes'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackRoute?: string
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackRoute = ROUTES.HOME,
}) => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <div>Unauthorized</div> // TODO: Replace with proper redirect
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={fallbackRoute} replace />
  }

  return <>{children}</>
}