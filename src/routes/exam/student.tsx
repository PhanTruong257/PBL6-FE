import { StudentExamListPage } from '@/features/exam/pages'
import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/exam/student')({
  component: () => (
    <MainLayout>
      <StudentExamListPage />
    </MainLayout>
  ),
})
