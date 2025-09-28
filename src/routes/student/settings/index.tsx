import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from "@/features/settings"

export const Route = createFileRoute('/student/settings/')({
  component: StudentSettingsIndex
})

function StudentSettingsIndex() {
  return <ProfileForm role="student" />
}