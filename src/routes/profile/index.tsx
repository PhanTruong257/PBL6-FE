import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/profile'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'

/**
 * Unified profile route
 * All users (admin, teacher, student) use the same profile page
 */
export const Route = createFileRoute('/profile/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <ProfilePage />
      </MainLayout>
    </RequireAuth>
  ),
})