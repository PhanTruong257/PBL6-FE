import { useState, useEffect } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/libs/utils/cn'
import {
  useConversations,
  useUnreadByConversation,
  conversationKeys,
} from '../hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useSocket, useAllUsers, useSearchUsers } from '@/global/hooks'
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
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [openUserSearch, setOpenUserSearch] = useState(false)

  const {
    data: conversationsData,
    isLoading,
    refetch: refetchConversations,
  } = useConversations({ userId: currentUserId })
  const queryClient = useQueryClient()
  const { unreadByConversation } = useUnreadByConversation(currentUserId)
  const { socket } = useSocket()

  // Fetch users for search
  const { users: allUsers, isLoading: isLoadingUsers } = useAllUsers()
  const { users: userSearchResults } = useSearchUsers(
    searchQuery,
    currentUserId,
  )

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
          const conversations =
            old?.data?.conversations ||
            old?.conversations ||
            (Array.isArray(old) ? old : [])
          const idx = conversations.findIndex(
            (c: any) => c.id === message.conversation_id,
          )
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
  const conversations =
    conversationsData?.data?.conversations ||
    conversationsData?.conversations ||
    (Array.isArray(conversationsData) ? conversationsData : [])

  // Filter conversations by search query (search in receiver name/email)
  const filteredConversations = conversations.filter((conv: any) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const receiverName = conv.receiver_name?.toLowerCase() || ''
    const receiverEmail = conv.receiver_email?.toLowerCase() || ''
    return receiverName.includes(query) || receiverEmail.includes(query)
  })

  const handleSelectUserFromSearch = async (userId: number) => {
    // Check if conversation with this user already exists
    const existingConv = conversations.find(
      (conv: any) => conv.receiver_id === userId,
    )

    if (existingConv) {
      // Open existing conversation
      onSelectConversation(existingConv)
    } else {
      // Create new conversation will be handled by clicking on user in dropdown
      // For now, just show the create conversation dialog
    }

    setSearchQuery('')
    setOpenUserSearch(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (!value.trim()) {
      setOpenUserSearch(false)
    } else {
      setOpenUserSearch(true)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
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
            onChange={handleSearchChange}
            className="pl-9"
            onBlur={() => setTimeout(() => setOpenUserSearch(false), 200)}
            onFocus={() => searchQuery.trim() && setOpenUserSearch(true)}
          />

          {/* User search dropdown */}
          {openUserSearch && userSearchResults.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-[300px] overflow-auto">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Tìm kiếm người dùng
                </div>
                {userSearchResults.map((user) => {
                  // Check if conversation exists
                  const existingConv = conversations.find(
                    (conv: any) => conv.receiver_id === user.user_id,
                  )

                  return (
                    <button
                      key={user.user_id}
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 transition-colors"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        if (existingConv) {
                          onSelectConversation(existingConv)
                          setSearchQuery('')
                          setOpenUserSearch(false)
                        } else {
                          handleSelectUserFromSearch(user.user_id)
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={user.avatar}
                          className="rounded-full object-cover w-full h-full"
                        />
                        <AvatarFallback className="bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center w-full h-full">
                          {user.full_name?.[0] || user.email[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {user.full_name || 'Chưa có tên'}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                      {existingConv && (
                        <span className="text-xs text-muted-foreground">
                          Đã có cuộc trò chuyện
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
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
              const receiverName =
                conversation.receiver_name ||
                `User #${conversation.receiver_id}`
              // Get unread count for this conversation
              const unreadCount = unreadByConversation[conversation.id] || 0
              const hasUnread = unreadCount > 0

              return (
                <div
                  key={conversation.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent',
                    isSelected && 'bg-accent',
                    hasUnread && 'bg-accent/50',
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
                      <div
                        className={cn(
                          'truncate text-sm',
                          hasUnread && 'font-semibold',
                        )}
                      >
                        {receiverName}
                      </div>
                      {lastMessage && (
                        <div
                          className={cn(
                            'text-xs shrink-0',
                            hasUnread
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground',
                          )}
                        >
                          {formatTime(lastMessage.timestamp)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={cn(
                          'truncate text-xs',
                          hasUnread
                            ? 'text-foreground font-medium'
                            : 'text-muted-foreground',
                        )}
                      >
                        {lastMessage?.content || 'Chưa có tin nhắn'}
                      </div>
                      {hasUnread && (
                        <Badge
                          variant="destructive"
                          className="ml-auto h-5 min-w-[20px] px-1.5 text-[10px] flex items-center justify-center shrink-0"
                        >
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
