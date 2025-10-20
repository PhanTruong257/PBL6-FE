import { ProfilePage } from '@/features/settings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/settings/profile')({
  component: ProfilePage,
})

