import { createFileRoute } from '@tanstack/react-router'
import { SettingsLayout } from '@/features/settings'
import { RequireAuth } from '@/components/auth/require-auth'
import { RequireRole } from '@/components/auth/require-role'

export const Route = createFileRoute('/admin/settings')({
  component: () => (
    <RequireAuth>
      <RequireRole allowedRoles={['admin']}>
        <SettingsLayout role="admin" basePath="/admin" />
      </RequireRole>
    </RequireAuth>
  ),
})
