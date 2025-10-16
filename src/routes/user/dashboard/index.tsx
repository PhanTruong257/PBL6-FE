import { createFileRoute } from '@tanstack/react-router'
import { UserDashboardPage } from '@/features/dashboard'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'
import { MainLayout } from '@/components/layout/main-layout'

export const Route = createFileRoute('/user/dashboard/')({
  component: () => (
    <RequireAuth>
      <RequireRole allowedRoles={['teacher', 'user']}>
        <MainLayout>
          <UserDashboardPage />
        </MainLayout>
      </RequireRole>
    </RequireAuth>
  ),
})
