import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/settings'

export const Route = createFileRoute('/admin/settings/_layout')({
  component: SettingsLayout
})

function SettingsLayout() {
  return <Settings role="admin" basePath="/admin" />
}