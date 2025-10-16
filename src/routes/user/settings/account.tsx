import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '@/features/settings'

export const Route = createFileRoute('/user/settings/account')({
  component: AccountPage,
})
