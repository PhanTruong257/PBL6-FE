import { createFileRoute, Navigate } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { QuestionsPage } from '@/features/questions'

/**
 * Questions route - Accessible by users with 'view questions' permission
 */
export const Route = createFileRoute('/questions/' as any)({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <QuestionsPage />
      </MainLayout>
    </RequireAuth>
  ),
})
