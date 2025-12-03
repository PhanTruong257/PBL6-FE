import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { useSearch } from '@tanstack/react-router'
import { ConversationList } from '../components/conversation-list'
import { ChatWindow } from '../components/chat-window'
import { currentUserState } from '@/global/recoil/user'
import { useConversations, useConversation } from '../hooks'
import type { ConversationWithUser } from '../types'

export function ConversationPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    ConversationWithUser | undefined
  >()

  // Get conversationId from URL search params
  const searchParams = useSearch({ from: '/conversation/' })
  const initialConversationId = searchParams.conversationId

  // Get current user from Recoil
  const currentUser = useRecoilValue(currentUserState)
  const currentUserId = currentUser?.user_id || 0

  // Prefetch conversations data immediately when page loads
  const { data: conversationsData } = useConversations({
    userId: currentUserId,
  })

  // Fetch specific conversation if conversationId is provided
  const { data: specificConversation } = useConversation(
    initialConversationId || 0,
    !!initialConversationId && !selectedConversation,
  )

  // Auto-select conversation from URL param
  useEffect(() => {
    if (initialConversationId && conversationsData?.data?.conversations) {
      // First try to find in loaded conversations
      const found = conversationsData.data.conversations.find(
        (conv: ConversationWithUser) => conv.id === initialConversationId,
      )
      if (found && !selectedConversation) {
        setSelectedConversation(found)
      }
    }
  }, [initialConversationId, conversationsData, selectedConversation])

  // If not found in list, use the fetched specific conversation
  useEffect(() => {
    if (
      specificConversation?.data &&
      !selectedConversation &&
      initialConversationId
    ) {
      setSelectedConversation(specificConversation.data as ConversationWithUser)
    }
  }, [specificConversation, selectedConversation, initialConversationId])

  useEffect(() => {
    console.log(
      '📋 [CONVERSATION_PAGE] Conversations data loaded:',
      conversationsData,
    )
  }, [conversationsData])

  // Show loading or error if user not logged in
  if (!currentUser || !currentUserId) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để sử dụng tính năng chat
          </p>
        </div>
      </div>
    )
  }

  const handleSelectConversation = (conversation: ConversationWithUser) => {
    console.log('🎯 [CONVERSATION_PAGE] Conversation selected:', conversation)
    setSelectedConversation(conversation)
  }

  return (
    <div className="flex h-[calc(100vh-64px)] gap-0">
      {/* Conversations List Sidebar */}
      <div className="w-80 border-r">
        <ConversationList
          currentUserId={currentUserId}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          onCreateConversation={() => {}} // Dialog handles its own open state
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          conversation={selectedConversation}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  )
}
