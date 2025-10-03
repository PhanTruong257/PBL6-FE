import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/features/settings'

export const Route = createFileRoute('/student/settings/account')({
  component: AccountPage,
})
