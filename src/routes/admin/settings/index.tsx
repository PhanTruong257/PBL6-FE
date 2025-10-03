import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/')({
  component: ProfilePage,
})
