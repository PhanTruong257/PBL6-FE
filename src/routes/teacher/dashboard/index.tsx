import { createFileRoute } from '@tanstack/react-router'
import { TeacherDashboardPage } from '@/features/dashboard'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'

export const Route = createFileRoute('/teacher/dashboard/')({
  // component: () => (
  //   <RequireAuth>
  //     <RequireRole allowedRoles={['teacher']}>
  //       <TeacherDashboardPage />
  //     </RequireRole>
  //   </RequireAuth>
  // ),
  component: TeacherDashboardPage
})
