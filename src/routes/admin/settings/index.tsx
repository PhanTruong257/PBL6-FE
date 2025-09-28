import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/')({
  component: AdminSettingsIndex
})

function AdminSettingsIndex() {
  return <ProfileForm role='admin' />
}