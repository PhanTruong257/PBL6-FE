import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/account')({
  component: AccountPage,
})
