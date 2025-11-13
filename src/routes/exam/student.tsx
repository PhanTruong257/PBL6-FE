import { StudentExamListPage } from '@/features/exam/pages'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exam/student')({
  component: StudentExamListPage,
})
