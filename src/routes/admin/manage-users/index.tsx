import { createFileRoute } from '@tanstack/react-router'
import { ManageTeacherPage } from '@/features/manage-user'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/admin/manage-users/')({
  component: () => (
    // <RequireAuth>
    //   <RequireRole allowedRoles={['admin']}>
        <MainLayout>        
          <ManageTeacherPage />
        </MainLayout>
    //   </RequireRole>
    // </RequireAuth>
  ),
})
