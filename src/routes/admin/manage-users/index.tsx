import { createFileRoute } from '@tanstack/react-router'
import { ManageTeacherPage } from '@/features/manage-user'
import { MainLayout } from '@/components/layout'
import { RequireAuth } from '@/components/auth'

export const Route = createFileRoute('/admin/manage-users/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <ManageTeacherPage />
      </MainLayout>
    </RequireAuth>
  ),
})
