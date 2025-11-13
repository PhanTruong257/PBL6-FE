import { useState, useEffect } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/libs/utils/cn'
import { useConversations, useUnreadByConversation, conversationKeys } from '../hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useGlobalSocket } from '@/global/providers/socket-provider'
import { CreateConversationDialog } from './create-conversation-dialog'
import type { ConversationWithUser } from '../types'

interface ConversationListProps {
    currentUserId: number
    selectedConversationId?: number
    onSelectConversation: (conversation: ConversationWithUser) => void
    onCreateConversation: () => void
}

export function ConversationList({
    currentUserId,
    selectedConversationId,
    onSelectConversation,
    onCreateConversation,
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const { data: conversationsData, isLoading, refetch: refetchConversations } = useConversations({ userId: currentUserId })
    const queryClient = useQueryClient()
    const { unreadByConversation } = useUnreadByConversation(currentUserId)
    const { socket } = useGlobalSocket()

    // Listen for new messages to update conversation list
    useEffect(() => {
        if (!socket) return

        console.log('📋 [CONVERSATION_LIST] Setting up real-time listeners')

        const handleMessageReceived = (message: any) => {
            // Optimistically update conversations list preview so UI shows latest content immediately.
            try {
                const key = conversationKeys.list({ userId: currentUserId })
                queryClient.setQueryData<any>(key, (old: any) => {
                    if (!old) {
                        // fallback to refetch if no cache
                        refetchConversations()
                        return old
                    }

                    // Normalize conversations array in different response shapes
                    const conversations = old?.data?.conversations || old?.conversations || (Array.isArray(old) ? old : [])
                    const idx = conversations.findIndex((c: any) => c.id === message.conversation_id)
                    if (idx === -1) {
                        // conversation not present in list cache -> refetch to be safe
                        refetchConversations()
                        return old
                    }

                    const updated = [...conversations]
                    // Update last_message preview (optimistic). Use message.timestamp/content even if id is temporary.
                    updated[idx] = {
                        ...updated[idx],
                        last_message: {
                            id: message.id,
                            content: message.content,
                            timestamp: message.timestamp,
                        },
                    }

                    // Return in the same shape as `old`
                    if (old?.data?.conversations) {
                        return { ...old, data: { ...old.data, conversations: updated } }
                    } else if (old?.conversations) {
                        return { ...old, conversations: updated }
                    }
                    return updated
                })
            } catch (e) {
                // fallback
                refetchConversations()
            }
        }

        const handleMessagesRead = (_data: any) => {
            refetchConversations()
        }

        socket.on('message:received', handleMessageReceived)
        socket.on('messages:read', handleMessagesRead)

        return () => {
            socket.off('message:received', handleMessageReceived)
            socket.off('messages:read', handleMessagesRead)
        }
    }, [socket, refetchConversations])

    // Backend returns nested structure: { success, data: { conversations } }
    const conversations = conversationsData?.data?.conversations
        || conversationsData?.conversations
        || (Array.isArray(conversationsData) ? conversationsData : [])

    const filteredConversations = conversations.filter(() => true)

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) {
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } else if (days === 1) {
            return 'Hôm qua'
        } else if (days < 7) {
            return `${days} ngày trước`
        } else {
            return date.toLocaleDateString('vi-VN')
        }
    }

    return (
        <div className="flex h-full flex-col border-r bg-background">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold">Tin nhắn</h2>
                <CreateConversationDialog
                    currentUserId={currentUserId}
                    onConversationCreated={(conversation) => {
                        refetchConversations()
                        onSelectConversation(conversation)
                    }}
                />
            </div>

            {/* Search */}
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="text-sm text-muted-foreground">Đang tải...</div>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8">
                        <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
                        <div className="mt-4 text-center">
                            <div className="text-sm font-medium">Chưa có cuộc trò chuyện</div>
                            <div className="text-xs text-muted-foreground">
                                Bấm nút + để bắt đầu trò chuyện mới
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {filteredConversations.map((conversation: any) => {
                            const isSelected = conversation.id === selectedConversationId
                            // Use last_message from backend (snake_case)
                            const lastMessage = conversation.last_message
                            // Get receiver info from backend
                            const receiverName = conversation.receiver_name || `User #${conversation.receiver_id}`
                            // Get unread count for this conversation
                            const unreadCount = unreadByConversation[conversation.id] || 0
                            const hasUnread = unreadCount > 0

                            return (
                                <div
                                    key={conversation.id}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent",
                                        isSelected && "bg-accent",
                                        hasUnread && "bg-accent/50"
                                    )}
                                    onClick={() => onSelectConversation(conversation)}
                                >
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>
                                                {receiverName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        {hasUnread && (
                                            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-destructive border-2 border-background" />
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className={cn(
                                                "truncate text-sm",
                                                hasUnread && "font-semibold"
                                            )}>
                                                {receiverName}
                                            </div>
                                            {lastMessage && (
                                                <div className={cn(
                                                    "text-xs shrink-0",
                                                    hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
                                                )}>
                                                    {formatTime(lastMessage.timestamp)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            <div className={cn(
                                                "truncate text-xs",
                                                hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
                                            )}>
                                                {lastMessage?.content || 'Chưa có tin nhắn'}
                                            </div>
                                            {hasUnread && (
                                                <Badge variant="destructive" className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] flex items-center justify-center shrink-0">
                                                    {unreadCount > 99 ? '99+' : unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}