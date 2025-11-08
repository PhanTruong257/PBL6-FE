import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/libs/utils/cn'
import { useSocket } from '../context/SocketContext'
import { useRealtimeChat } from '../hooks/useRealtimeChat'
import { MessageType } from '../types/socket-events'
import type { ConversationWithUser } from '../types'

interface ChatWindowProps {
    conversation?: ConversationWithUser
    currentUserId: number
}

export function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
    const [message, setMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { socket, socketState } = useSocket()

    // Use real-time chat hook
    const {
        messages,
        sendMessage,
        markAsRead,
        isLoading,
    } = useRealtimeChat({
        socket,
        conversationId: conversation?.id || 0,
        userId: currentUserId,
        enabled: !!conversation,
    })



    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Mark messages as read when conversation changes
    useEffect(() => {
        if (conversation?.id && messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage && lastMessage.sender_id !== currentUserId) {
                markAsRead(lastMessage.id)
            }
        }
    }, [conversation?.id, messages, currentUserId, markAsRead])

    const handleSendMessage = async () => {
        if (!message.trim() || !conversation) return

        try {
            sendMessage(message.trim(), MessageType.TEXT)
            setMessage('')
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay'
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua'
        } else {
            return date.toLocaleDateString('vi-VN')
        }
    }

    if (!conversation) {
        return (
            <div className="flex h-full items-center justify-center bg-muted/20">
                <div className="text-center">
                    <div className="text-lg font-medium text-muted-foreground">
                        Chọn cuộc trò chuyện để bắt đầu nhắn tin
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.receiver_avatar} />
                        <AvatarFallback>
                            {conversation.receiver_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-semibold">{conversation.receiver_name || 'Người dùng'}</div>
                        <div className="text-xs text-muted-foreground">
                            {socketState.isConnected ? (
                                <span className="text-green-600">● Online</span>
                            ) : socketState.isConnecting ? (
                                <span className="text-yellow-600">● Đang kết nối...</span>
                            ) : (
                                <span className="text-red-600">● Offline</span>
                            )}
                        </div>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem thông tin</DropdownMenuItem>
                        <DropdownMenuItem>Tìm kiếm tin nhắn</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Xóa cuộc trò chuyện</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Messages - ScrollArea with proper height */}
            <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="text-sm text-muted-foreground">Đang tải tin nhắn...</div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground">Chưa có tin nhắn nào</div>
                                <div className="text-xs text-muted-foreground">Hãy gửi tin nhắn đầu tiên</div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg: any, index: number) => {
                                const isCurrentUser = msg.sender_id === currentUserId
                                const showDate = index === 0 ||
                                    formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp)

                                // Use client_id for optimistic messages, otherwise use id
                                const messageKey = msg.client_id || msg.id || `msg-${index}`

                                return (
                                    <div key={messageKey}>
                                        {showDate && (
                                            <div className="flex justify-center py-2">
                                                <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                                    {formatDate(msg.timestamp)}
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className={cn(
                                                "flex gap-2",
                                                isCurrentUser ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            {!isCurrentUser && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={conversation.receiver_avatar} />
                                                    <AvatarFallback className="text-xs">
                                                        {conversation.receiver_name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}

                                            <div
                                                className={cn(
                                                    "max-w-[70%] rounded-lg p-3 text-sm",
                                                    isCurrentUser
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                )}
                                            >
                                                <div>{msg.content}</div>
                                                <div
                                                    className={cn(
                                                        "mt-1 text-xs",
                                                        isCurrentUser
                                                            ? "text-primary-foreground/70"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {formatTime(msg.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="border-t p-4 flex-shrink-0 bg-background">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Smile className="h-4 w-4" />
                    </Button>

                    <div className="flex-1">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={!socketState.isConnected || isLoading}
                        />
                    </div>

                    <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || !socketState.isConnected || isLoading}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}