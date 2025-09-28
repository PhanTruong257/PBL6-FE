import { Navigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '@/store'
import { ROUTES } from '@/utils/constants/routes'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo,
}) => {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return url
    return (
      <Navigate
        to={redirectTo || ROUTES.LOGIN}
        search={{ from: location.pathname }}
        replace
      />
    )
  }

  if (!requireAuth && isAuthenticated) {
    // Redirect authenticated users away from auth pages
    const from = "/"
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}