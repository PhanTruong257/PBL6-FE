import { useState } from 'react'
import { Plus, Search, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/libs/utils/cn'
import { useConversations } from '../hooks'
import type { ConversationWithUser } from '../types'

interface ConversationListProps {
    selectedConversationId?: number
    onSelectConversation: (conversation: ConversationWithUser) => void
    onCreateConversation: () => void
}

export function ConversationList({
    selectedConversationId,
    onSelectConversation,
    onCreateConversation,
}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const { data: conversationsData, isLoading } = useConversations()
    const conversations = conversationsData?.conversations || []

    const filteredConversations = (conversations as ConversationWithUser[]).filter((conversation) =>
        conversation.receiver_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                <Button size="sm" onClick={onCreateConversation}>
                    <Plus className="h-4 w-4" />
                </Button>
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
                        {filteredConversations.map((conversation) => {
                            const isSelected = conversation.id === selectedConversationId
                            const hasUnread = (conversation.unread_count || 0) > 0

                            return (
                                <div
                                    key={conversation.id}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent",
                                        isSelected && "bg-accent"
                                    )}
                                    onClick={() => onSelectConversation(conversation)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={conversation.receiver_avatar} />
                                        <AvatarFallback>
                                            {conversation.receiver_name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center justify-between">
                                            <div className={cn(
                                                "truncate text-sm",
                                                hasUnread && "font-semibold"
                                            )}>
                                                {conversation.receiver_name || 'Người dùng'}
                                            </div>
                                            {conversation.last_message && (
                                                <div className="text-xs text-muted-foreground">
                                                    {formatTime(conversation.last_message.timestamp)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className={cn(
                                                "truncate text-xs",
                                                hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
                                            )}>
                                                {conversation.last_message?.content || 'Chưa có tin nhắn'}
                                            </div>
                                            {hasUnread && (
                                                <Badge variant="default" className="h-5 w-5 rounded-full p-0 text-xs">
                                                    {conversation.unread_count}
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