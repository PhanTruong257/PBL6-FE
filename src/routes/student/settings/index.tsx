import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/settings'

export const Route = createFileRoute('/student/settings/')({
  component: ProfilePage,
})
