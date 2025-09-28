import { createFileRoute } from '@tanstack/react-router'
import { NotificationsForm } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/notifications')({
  component: TeacherSettingsNotifications
})

function TeacherSettingsNotifications() {
  return <NotificationsForm role="teacher" />
}