import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardPage } from '@/features/dashboard'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'

export const Route = createFileRoute('/admin/dashboard/')({
  component: () => (
    <RequireAuth>
      <RequireRole allowedRoles={['admin']}>
        <AdminDashboardPage />
      </RequireRole>
    </RequireAuth>
  ),
})
