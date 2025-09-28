import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/components/layout/main-layout'

export const Route = createFileRoute('/teacher/_layout')({
  component: TeacherLayoutComponent
})

function TeacherLayoutComponent() {
  return <MainLayout />
}
