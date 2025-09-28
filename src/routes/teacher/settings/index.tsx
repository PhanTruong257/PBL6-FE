import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/')({
  component: TeacherSettingsIndex
})

function TeacherSettingsIndex() {
  return <ProfileForm role="teacher" />
}