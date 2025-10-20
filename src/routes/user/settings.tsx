import { createFileRoute } from '@tanstack/react-router'
import { SettingsLayout } from '@/features/settings'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'

export const Route = createFileRoute('/user/settings')({
  component: () => (
    <RequireAuth>
      <RequireRole allowedRoles={['teacher']}>
        <SettingsLayout role="teacher" basePath="/user" />
      </RequireRole>
    </RequireAuth>
  ),
})
