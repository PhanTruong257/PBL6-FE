import { createFileRoute } from '@tanstack/react-router'
import { AppearanceForm } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/appearance')({
  component: AdminSettingsAppearance
})

function AdminSettingsAppearance() {
  return <AppearanceForm role="admin" />
}
