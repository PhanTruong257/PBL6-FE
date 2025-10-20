import { createFileRoute, Navigate } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { DEFAULT_ROUTES_BY_ROLE } from '@/libs/constants/routes.constant'

export const Route = createFileRoute('/')({
  component: IndexRedirect,
})

/**
 * Index route with role-based redirect
 * - Admin/Teacher -> /classes (Classes listing page)
 * - Student/User -> /dashboard (Student dashboard)
 */
function IndexRedirect() {
  return (
    <RequireAuth>
      <RoleBasedRedirect />
    </RequireAuth>
  )
}

function RoleBasedRedirect() {
  const user = useRecoilValue(currentUserState)

  if (!user) {
    return <div>Loading...</div>
  }

  // Get default route based on user role
  const defaultRoute = DEFAULT_ROUTES_BY_ROLE[user.role]

  return <Navigate to={defaultRoute} replace />
}
