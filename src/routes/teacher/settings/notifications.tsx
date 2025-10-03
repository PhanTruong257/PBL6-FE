import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/notifications')({
  component: NotificationsPage,
})
