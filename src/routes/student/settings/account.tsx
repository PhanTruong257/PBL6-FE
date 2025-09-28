import { createFileRoute } from '@tanstack/react-router'
import { AccountForm } from '@/features/settings'

export const Route = createFileRoute('/student/settings/account')({
  component: StudentSettingsAccount
})

function StudentSettingsAccount() {
  return <AccountForm role="student" />
}