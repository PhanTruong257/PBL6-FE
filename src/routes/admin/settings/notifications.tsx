import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/notifications')({
  component: NotificationsPage,
})
