import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/settings'

export const Route = createFileRoute('/teacher/settings/')({
  component: ProfilePage,
})
