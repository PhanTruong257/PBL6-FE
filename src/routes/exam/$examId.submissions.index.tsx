import { MainLayout } from '@/components/layout'
import { SubmissionsListPage } from '@/features/exam/pages/submissions-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exam/$examId/submissions/')({
  component: () => (
    <MainLayout>
      <SubmissionsListPage />
    </MainLayout>
  ),
})
