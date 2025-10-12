import { createFileRoute } from '@tanstack/react-router'
import { StudentDashboardPage } from '@/features/dashboard'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'

export const Route = createFileRoute('/student/dashboard/')({
  component: () => (
    <RequireAuth>
      <RequireRole allowedRoles={['user']}>
        <StudentDashboardPage />
      </RequireRole>
    </RequireAuth>
  ),
})
