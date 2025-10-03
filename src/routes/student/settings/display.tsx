import { createFileRoute } from '@tanstack/react-router'
import { DisplayPage } from '@/features/settings'

export const Route = createFileRoute('/student/settings/display')({
  component: DisplayPage,
})
