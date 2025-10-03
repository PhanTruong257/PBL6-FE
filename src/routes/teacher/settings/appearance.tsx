import { createFileRoute } from '@tanstack/react-router'
import { AppearancePage } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/appearance')({
  component: AppearancePage,
})
