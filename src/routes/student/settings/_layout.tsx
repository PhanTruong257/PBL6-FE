import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/settings'

export const Route = createFileRoute('/student/settings/_layout')({
  component: SettingsLayout
})

function SettingsLayout() {
  return <Settings role="student" basePath="/student" />
}
