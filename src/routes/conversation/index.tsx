import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { ConversationPage } from '@/features/conversation'
import { z } from 'zod'

const conversationSearchSchema = z.object({
  conversationId: z.number().optional(),
})

export const Route = createFileRoute('/conversation/')({
  validateSearch: conversationSearchSchema,
  component: () => (
    <RequireAuth>
      <MainLayout>
        <ConversationPage />
      </MainLayout>
    </RequireAuth>
  ),
})
