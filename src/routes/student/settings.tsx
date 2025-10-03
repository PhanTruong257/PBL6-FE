import { createFileRoute } from '@tanstack/react-router'
import { SettingsLayout } from '@/features/settings'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'

export const Route = createFileRoute('/student/settings')({
  component: () => (
    <RequireAuth>
      <RequireRole allowedRoles={['student']}>
        <SettingsLayout role="student" basePath="/student" />
      </RequireRole>
    </RequireAuth>
  ),
})
