import { createFileRoute } from '@tanstack/react-router'
import { DisplayPage } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/display')({
  component: DisplayPage,
})
