import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardPage } from '@/features/dashboard'

/**
 * Unified dashboard route with role-based rendering
 * Shows different content based on user role and permissions
 */
export const Route = createFileRoute('/dashboard/')({
  component: () => (
    // <RequireAuth>
    <MainLayout>
      <DashboardPage />
    </MainLayout>
    // </RequireAuth>
  ),
})