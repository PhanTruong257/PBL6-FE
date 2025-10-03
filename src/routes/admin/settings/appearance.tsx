import { createFileRoute } from '@tanstack/react-router'
import { AppearancePage } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/appearance')({
  component: AppearancePage,
})
