import { useEffect, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useIsAuthenticated } from '@/features/auth/hooks/use-auth'
import { ROLE_PERMISSIONS } from '@/libs/constants/roles.constant'
import { DEFAULT_ROUTES_BY_ROLE } from '@/libs/constants/routes.constant'
import type { UserRole } from '@/types/user'

interface UseRoleGuardOptions {
  allowedRoles?: UserRole[]
  requiredPermissions?: string[]
  redirectTo?: string
  onUnauthorized?: () => void
}

export function useRoleGuard(options: UseRoleGuardOptions = {}) {
  const { allowedRoles, requiredPermissions, redirectTo, onUnauthorized } = options
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useIsAuthenticated()
  const [isChecked, setIsChecked] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      setIsChecked(true)
      return
    }

    const userRole = user.role
    let isUnauthorized = false

    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) {
        isUnauthorized = true
      }
    }

    // TODO: Permission checking not implemented yet
    // Currently only checking roles, always return true for permissions
    // Uncomment and implement when permission-based access control is required
    if (!isUnauthorized && requiredPermissions && requiredPermissions.length > 0) {
      // For now, just return true - no permission check
      // const userPermissions = ROLE_PERMISSIONS[userRole]
      // const hasAllPermissions = requiredPermissions.every((permission) =>
      //   userPermissions.includes(permission)
      // )
      // if (!hasAllPermissions) {
      //   isUnauthorized = true
      // }
    }

    if (isUnauthorized) {
      if (onUnauthorized) {
        onUnauthorized()
      } else {
        const destination = redirectTo || DEFAULT_ROUTES_BY_ROLE[userRole]
        router.navigate({ to: destination })
      }
    }

    setIsChecked(true)
  }, [isAuthenticated, isLoading, user, allowedRoles, requiredPermissions, redirectTo, onUnauthorized, router])

  // TODO: Permission checking helpers - currently just return true (only role checking is active)
  // Implement these when permission-based access control is required
  const hasPermission = (_permission: string): boolean => {
    return true
    // if (!user) return false
    // const userPermissions = ROLE_PERMISSIONS[user.role]
    // return userPermissions.includes(permission)
  }

  const hasAnyPermission = (_permissions: string[]): boolean => {
    return true
    // if (!user) return false
    // const userPermissions = ROLE_PERMISSIONS[user.role]
    // return permissions.some((permission) => userPermissions.includes(permission))
  }

  const hasAllPermissions = (_permissions: string[]): boolean => {
    return true
    // if (!user) return false
    // const userPermissions = ROLE_PERMISSIONS[user.role]
    // return permissions.every((permission) => userPermissions.includes(permission))
  }

  const isRoleAllowed = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  return {
    isAuthenticated,
    isLoading,
    isChecking: isLoading || !isChecked,
    user,
    userRole: user?.role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRoleAllowed,
  }
}
