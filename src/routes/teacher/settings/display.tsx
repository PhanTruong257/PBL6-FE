import { createFileRoute } from '@tanstack/react-router'
import { DisplayForm } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/display')({
  component: TeacherSettingsDisplay
})

function TeacherSettingsDisplay() {
  return <DisplayForm role="teacher" />
}