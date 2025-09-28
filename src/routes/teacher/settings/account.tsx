import { createFileRoute } from '@tanstack/react-router'
import { AccountForm } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/account')({
  component: TeacherSettingsAccount
})

function TeacherSettingsAccount() {
  return <AccountForm role="teacher" />
}