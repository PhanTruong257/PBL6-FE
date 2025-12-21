import { type ReactNode } from 'react'
import { Navigate } from '@tanstack/react-router'
import { useAuthGuard } from '@/global/hooks/use-auth-guard'
import { Loader2 } from 'lucide-react'

interface RequireAuthProps {
  children: ReactNode
  redirectTo?: string
}

/**
 * Component wrapper that requires authentication
 * Redirects to login if user is not authenticated
 */
export function RequireAuth({ children, redirectTo = '/auth/login' }: RequireAuthProps) {
  const { isAuthenticated, isChecking } = useAuthGuard({ 
    redirectTo,
    requireAuth: true 
  })

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />
  }

  // Render children if authenticated
  return <>{children}</>
}
