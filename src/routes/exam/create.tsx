import { createFileRoute } from '@tanstack/react-router'
import { CreateExamPage } from '@/features/exam'
import { MainLayout } from '@/components/layout'

export const Route = createFileRoute('/exam/create')({
  component: () => (
    <MainLayout>
      <CreateExamPage />
    </MainLayout>
  ),
})
