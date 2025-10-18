import { createFileRoute } from '@tanstack/react-router'
import { DisplayPage } from '@/features/settings'

export const Route = createFileRoute('/user/settings/display')({
  component: DisplayPage,
})
