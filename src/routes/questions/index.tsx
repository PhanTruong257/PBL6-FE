import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { QuestionsPage } from '@/features/questions'

export const Route = createFileRoute('/questions/')({
  component: QuestionsRoute,
})

function QuestionsRoute() {
  return (
    <RequireAuth>
      <MainLayout>
        <QuestionsPage />
      </MainLayout>
    </RequireAuth>
  )
}
