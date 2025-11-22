import { MainLayout } from '@/components/layout'
import { SubmissionDetailPage } from '@/features/exam/pages/submission-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/exam/$examId/submissions/$submissionId'
)({
  component: () => (
    <MainLayout>
      <SubmissionDetailPage />
    </MainLayout>
  ),
})
