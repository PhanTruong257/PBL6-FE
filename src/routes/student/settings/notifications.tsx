import { createFileRoute } from '@tanstack/react-router'
import { NotificationsForm } from '@/features/settings'

export const Route = createFileRoute('/student/settings/notifications')({
  component: StudentSettingsNotifications
})

function StudentSettingsNotifications() {
  return <NotificationsForm role="student" />
}