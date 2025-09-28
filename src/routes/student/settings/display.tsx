import { createFileRoute } from '@tanstack/react-router'
import { DisplayForm } from '@/features/settings'

export const Route = createFileRoute('/student/settings/display')({
  component: StudentSettingsDisplay
})

function StudentSettingsDisplay() {
  return <DisplayForm role="student" />
}
