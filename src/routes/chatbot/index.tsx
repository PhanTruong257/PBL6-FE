import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/components/layout/main-layout'
import { ChatbotPage } from '@/features/chatbot'

/**
 * Chatbot route - AI assistant for student queries
 */
export const Route = createFileRoute('/chatbot/')({
  component: ChatbotRoute,
})

function ChatbotRoute() {
  return (
    <MainLayout>
      <ChatbotPage />
    </MainLayout>
  )
}