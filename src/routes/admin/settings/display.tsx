import { createFileRoute } from '@tanstack/react-router'
import { DisplayForm } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/display')({
  component: AdminSettingsDisplay
})

function AdminSettingsDisplay() {
  return <DisplayForm role="admin" />
}
