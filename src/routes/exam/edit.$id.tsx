import { createFileRoute } from '@tanstack/react-router'
import { EditExamPage } from '@/features/exam'

export const Route = createFileRoute('/exam/edit/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EditExamPage />
}
