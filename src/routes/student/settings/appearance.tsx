import { createFileRoute } from '@tanstack/react-router'
import { AppearanceForm } from '@/features/settings'

export const Route = createFileRoute('/student/settings/appearance')({
  component: StudentSettingsAppearance
})

function StudentSettingsAppearance() {
  return <AppearanceForm role="student" />
}