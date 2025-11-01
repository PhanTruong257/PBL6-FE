import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { ConversationPage } from '@/features/conversation'

export const Route = createFileRoute('/conversation/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <ConversationPage />
      </MainLayout>
    </RequireAuth>
  ),
})
