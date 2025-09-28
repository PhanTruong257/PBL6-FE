import { createFileRoute } from '@tanstack/react-router'
import { NotificationsForm } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/notifications')({
  component: AdminSettingsNotifications
})

function AdminSettingsNotifications() {
  return <NotificationsForm role="admin" />
}
