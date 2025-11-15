import { createFileRoute } from '@tanstack/react-router'
import { EditExamPage } from '@/features/exam'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/exam/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <MainLayout>
      <EditExamPage />
    </MainLayout>
  )
}
