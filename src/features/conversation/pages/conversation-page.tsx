import { useState } from 'react'
// import { useCurrentUser } from '@/features/auth/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Send, Search, Plus, MessageCircle, MoreVertical } from 'lucide-react'

// Mock data cho testing
const mockConversations = [
    {
        id: 1,
        participant: {
            id: 2,
            name: 'Nguyễn Văn A',
            avatar: undefined,
            email: 'nguyenvana@example.com'
        },
        lastMessage: {
            content: 'Chào bạn, tôi có thể hỏi về bài tập không?',
            timestamp: '2024-01-15T10:30:00',
            isRead: false
        },
        unreadCount: 2
    },
    {
        id: 2,
        participant: {
            id: 3,
            name: 'Trần Thị B',
            avatar: undefined,
            email: 'tranthib@example.com'
        },
        lastMessage: {
            content: 'Cảm ơn bạn đã giúp đỡ!',
            timestamp: '2024-01-14T16:45:00',
            isRead: true
        },
        unreadCount: 0
    },
    {
        id: 3,
        participant: {
            id: 4,
            name: 'Lê Văn C',
            avatar: undefined,
            email: 'levanc@example.com'
        },
        lastMessage: {
            content: 'Bài giảng hôm nay rất hay',
            timestamp: '2024-01-14T14:20:00',
            isRead: true
        },
        unreadCount: 0
    }
]

const mockMessages = [
    {
        id: 1,
        senderId: 3,
        senderName: 'Trần Thị B',
        content: 'Em không hiểu phần về React Hooks, thầy có thể giải thích thêm không ạ?',
        timestamp: '2024-01-15T10:25:00',
        isCurrentUser: false
    },
    {
        id: 2,
        senderId: 1,
        senderName: 'Tôi',
        content: 'React Hooks là cách để sử dụng state và lifecycle trong functional components. Ví dụ useState để quản lý state, useEffect để handle side effects.',
        timestamp: '2024-01-15T10:28:00',
        isCurrentUser: true
    },
    {
        id: 3,
        senderId: 3,
        senderName: 'Trần Thị B',
        content: 'Cảm ơn thầy! Em hiểu rồi ạ.',
        timestamp: '2024-01-15T10:30:00',
        isCurrentUser: false
    }
]

export function ConversationPage() {
    // const { data: currentUser } = useCurrentUser()
    const [selectedConversation, setSelectedConversation] = useState<any>(mockConversations[1]) // Trần Thị B
    const [newMessage, setNewMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
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

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Mock adding new message
            const newMsg = {
                id: Date.now(),
                senderId: 1,
                senderName: 'Tôi',
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
                isCurrentUser: true
            }
            console.log('Sending message:', newMsg)
            setNewMessage('')
            // In real app, would update messages state or call API
        }
    }

    const filteredConversations = mockConversations.filter(conv =>
        conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex h-[calc(100vh-60px)] gap-4">
            {/* Sidebar - Conversations List */}
            <Card className="w-80 flex flex-col flex-shrink-0">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Tin nhắn</CardTitle>
                        <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <div className="space-y-1 p-2">
                            {filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted/50 ${selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                                        }`}
                                    onClick={() => setSelectedConversation(conversation)}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={conversation.participant.avatar} />
                                        <AvatarFallback>
                                            {conversation.participant.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-sm truncate">
                                                {conversation.participant.name}
                                            </h4>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(conversation.lastMessage.timestamp)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conversation.lastMessage.content}
                                            </p>
                                            {conversation.unreadCount > 0 && (
                                                <Badge variant="default" className="ml-2 px-2 py-0 text-xs">
                                                    {conversation.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Separator orientation="vertical" />

            {/* Main Chat Area */}
            <div className="flex-1 min-w-0">
                <Card className="h-full flex flex-col overflow-hidden">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={selectedConversation.participant.avatar} />
                                            <AvatarFallback>
                                                {selectedConversation.participant.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">{selectedConversation.participant.name}</h3>
                                            <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <Separator />

                            {/* Messages */}
                            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                                <ScrollArea className="flex-1 p-4" style={{ maxHeight: 'calc(100vh - 220px)' }}>
                                    <div className="space-y-4">
                                        {mockMessages.map((message, index) => {
                                            const showDate = index === 0 ||
                                                formatDate(mockMessages[index - 1].timestamp) !== formatDate(message.timestamp)

                                            return (
                                                <div key={message.id}>
                                                    {showDate && (
                                                        <div className="flex justify-center py-2">
                                                            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                                                {formatDate(message.timestamp)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className={`flex gap-2 ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                                        {!message.isCurrentUser && (
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={selectedConversation.participant.avatar} />
                                                                <AvatarFallback className="text-xs">
                                                                    {selectedConversation.participant.name.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}

                                                        <div className={`max-w-[70%] rounded-lg p-3 text-sm ${message.isCurrentUser
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted'
                                                            }`}>
                                                            <div>{message.content}</div>
                                                            <div className={`mt-1 text-xs ${message.isCurrentUser
                                                                ? 'text-primary-foreground/70'
                                                                : 'text-muted-foreground'
                                                                }`}>
                                                                {formatTime(message.timestamp)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>

                                {/* Message Input */}
                                <div className="border-t p-4 flex-shrink-0">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Nhập tin nhắn..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleSendMessage()
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">Chọn cuộc trò chuyện</h3>
                                <p className="text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    )
}