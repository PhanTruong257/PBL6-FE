import { createFileRoute } from '@tanstack/react-router'
import { AppearancePage } from '@/features/settings'

export const Route = createFileRoute('/user/settings/appearance')({
  component: AppearancePage,
})
