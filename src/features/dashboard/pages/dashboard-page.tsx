import { useRecoilValue } from 'recoil'
import { currentUserState, isAdminSelector, isTeacherSelector } from '@/global/recoil/user'
import { AdminDashboardPage } from './admin-dashboard-page'
import { UserDashboardPage } from './user-dashboard-page'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

/**
 * Unified Dashboard Page
 * Shows different dashboard content based on user role
 */
export function DashboardPage() {
  const user = useRecoilValue(currentUserState)
  const isAdmin = useRecoilValue(isAdminSelector)
  const isTeacher = useRecoilValue(isTeacherSelector)

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to view your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Admin dashboard
  if (isAdmin) {
    return <AdminDashboardPage />
  }

  // Teacher or User dashboard
  if (isTeacher || user.role === 'user') {
    return <UserDashboardPage />
  }

  // Fallback (shouldn't reach here)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Unable to determine dashboard type for your role.
        </AlertDescription>
      </Alert>
    </div>
  )
}
