import { createFileRoute } from '@tanstack/react-router'
import { RolePermissionsPage } from '@/features/permissions'
import { MainLayout } from '@/components/layout'
import { RequireAuth } from '@/components/auth'

export const Route = createFileRoute('/admin/permissions/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <RolePermissionsPage />
      </MainLayout>
    </RequireAuth>
  ),
})
