import { ExamTakingPage } from '@/features/exam/pages/exam-taking-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exam/$examId/take')({
  component: ExamTakingPage,
})
