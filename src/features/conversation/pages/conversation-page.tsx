import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { ConversationList } from '../components/conversation-list'
import { ChatWindow } from '../components/chat-window'
import { SocketProvider } from '../context/SocketContext'
import { currentUserState } from '@/global/recoil/user'
import type { ConversationWithUser } from '../types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000/chat'

export function ConversationPage() {
    const [selectedConversation, setSelectedConversation] = useState<ConversationWithUser | undefined>()

    // Get current user from Recoil
    const currentUser = useRecoilValue(currentUserState)
    const currentUserId = currentUser?.user_id || 0

    // Show loading or error if user not logged in
    if (!currentUser || !currentUserId) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Vui lòng đăng nhập để sử dụng tính năng chat</p>
                </div>
            </div>
        )
    }

    const handleSelectConversation = (conversation: ConversationWithUser) => {
        setSelectedConversation(conversation)
    }

    return (
        <SocketProvider url={SOCKET_URL} userId={currentUserId}>
            <div className="flex h-[calc(100vh-64px)] gap-0">
                {/* Conversations List Sidebar */}
                <div className="w-80 border-r">
                    <ConversationList
                        currentUserId={currentUserId}
                        selectedConversationId={selectedConversation?.id}
                        onSelectConversation={handleSelectConversation}
                        onCreateConversation={() => { }} // Dialog handles its own open state
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
        </SocketProvider>
    )
}