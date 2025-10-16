import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/features/settings'

export const Route = createFileRoute('/user/settings/notifications')({
  component: NotificationsPage,
})
