import { createFileRoute } from '@tanstack/react-router'
import { NotificationsPage } from '@/features/settings'

export const Route = createFileRoute('/student/settings/notifications')({
  component: NotificationsPage,
})
