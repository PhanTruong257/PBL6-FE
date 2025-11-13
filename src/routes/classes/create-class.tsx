import { createFileRoute } from '@tanstack/react-router'
import { CreateClassPage } from '@/features/class/create-class'
import { RequireAuth } from '@/components/auth'
import { MainLayout } from '@/components/layout'

/**
 * Route: /classes/create-class
 * Protected route - Requires authentication
 * Only teachers can access (checked in CreateClassPage component)
 */
export const Route = createFileRoute('/classes/create-class')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <CreateClassPage />
      </MainLayout>
    </RequireAuth>
  ),
})
