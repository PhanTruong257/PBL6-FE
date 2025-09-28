import { createFileRoute } from '@tanstack/react-router'
import { AccountForm } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/account')({
  component: AdminSettingsAccount
})

function AdminSettingsAccount() {
  return <AccountForm role="admin" />
}
