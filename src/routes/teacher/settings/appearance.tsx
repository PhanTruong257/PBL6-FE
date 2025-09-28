import { createFileRoute } from '@tanstack/react-router'
import { AppearanceForm } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/appearance')({
  component: TeacherSettingsAppearance
})

function TeacherSettingsAppearance() {
  return <AppearanceForm role="teacher" />
}