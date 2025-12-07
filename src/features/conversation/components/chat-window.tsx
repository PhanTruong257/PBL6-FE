import { useState, useEffect } from 'react'
import { Send, Paperclip, Smile, MoreVertical, X, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/libs/utils/cn'
import { useSocket, usePresence } from '@/global/hooks'
import {
  useRealtimeChat,
  useChatFile,
  useChatMessages,
  useMessageFormatter,
} from '../hooks'
import { MessageType } from '../types/socket-events'
import type { ConversationWithUser } from '../types'

interface ChatWindowProps {
  conversation?: ConversationWithUser
  currentUserId: number
}

export function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
  const [message, setMessage] = useState('')

  const { socket, isConnected } = useSocket()
  const { isUserOnline, requestPresence } = usePresence()
  const { formatTime, formatDate } = useMessageFormatter()

  const { messages, sendMessage, markAsRead, isLoading } = useRealtimeChat({
    socket,
    conversationId: conversation?.id || 0,
    userId: currentUserId,
    enabled: !!conversation,
  })

  const {
    attachedFile,
    fileInputRef,
    uploadFileMutation,
    handleFileSelect,
    handleRemoveFile,
    handleAttachmentClick,
    downloadFile,
    uploadFile,
    setAttachedFile,
  } = useChatFile()

  const { messagesEndRef } = useChatMessages({
    conversationId: conversation?.id,
    currentUserId,
    messages,
    markAsRead,
  })

  // Request presence for the receiver when conversation changes
  useEffect(() => {
    if (conversation?.receiver_id) {
      requestPresence([conversation.receiver_id])
    }
  }, [conversation?.receiver_id, requestPresence])

  const handleSendMessage = async () => {
    if ((!message.trim() && !attachedFile) || !conversation) return

    try {
      if (attachedFile) {
        const uploadResult = await uploadFile(attachedFile)

        sendMessage(message.trim() || attachedFile.name, MessageType.FILE, {
          file_url: uploadResult.file_url,
          file_name: uploadResult.file_name,
          file_size: uploadResult.file_size,
        })

        setAttachedFile(null)
      } else {
        sendMessage(message.trim(), MessageType.TEXT)
      }

      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.receiver_avatar} />
              <AvatarFallback>
                {conversation.receiver_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online/Offline status indicator */}
            {isUserOnline(conversation.receiver_id) ? (
              <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            ) : (
              <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />
            )}
          </div>
          <div>
            <div className="font-semibold">
              {conversation.receiver_name || 'Người dùng'}
            </div>
            <div className="text-xs text-muted-foreground">
              {isUserOnline(conversation.receiver_id) ? (
                <span className="text-green-600">Online</span>
              ) : (
                <span className="text-gray-500">Offline</span>
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
            <DropdownMenuItem className="text-destructive">
              Xóa cuộc trò chuyện
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages - ScrollArea with proper height */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-muted-foreground">
                Đang tải tin nhắn...
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Chưa có tin nhắn nào
                </div>
                <div className="text-xs text-muted-foreground">
                  Hãy gửi tin nhắn đầu tiên
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: any, index: number) => {
                const isCurrentUser = msg.sender_id === currentUserId
                const showDate =
                  index === 0 ||
                  formatDate(messages[index - 1].timestamp) !==
                    formatDate(msg.timestamp)

                // Use client_id for optimistic messages, otherwise use id
                const messageKey = msg.client_id || msg.id || `msg-${index}`

                // Debug: Log all messages to see structure
                console.log(`Message ${index}:`, {
                  id: msg.id,
                  message_type: msg.message_type,
                  has_file_url: !!msg.file_url,
                  file_name: msg.file_name,
                  content: msg.content?.substring(0, 30),
                })

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
                        'flex gap-2',
                        isCurrentUser ? 'justify-end' : 'justify-start',
                      )}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={conversation.receiver_avatar} />
                          <AvatarFallback className="text-xs">
                            {conversation.receiver_name
                              ?.charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          'max-w-[70%] rounded-lg p-3 text-sm break-words',
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted',
                        )}
                      >
                        {msg.file_url ? (
                          <button
                            onClick={() =>
                              downloadFile(
                                msg.file_url,
                                msg.file_name,
                                msg.file_size,
                              )
                            }
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            <File className="h-4 w-4 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">
                                {msg.file_name ||
                                  (msg.file_url
                                    ? msg.file_url.split('/').pop()
                                    : null) ||
                                  'File đính kèm'}
                              </div>
                              {msg.file_size && (
                                <div
                                  className={cn(
                                    'text-xs',
                                    isCurrentUser
                                      ? 'text-primary-foreground/70'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  {(msg.file_size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              )}
                            </div>
                          </button>
                        ) : (
                          <div className="whitespace-pre-wrap break-words">
                            {msg.content}
                          </div>
                        )}
                        <div
                          className={cn(
                            'mt-1 text-xs',
                            isCurrentUser
                              ? 'text-primary-foreground/70'
                              : 'text-muted-foreground',
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
        {/* File attachment preview */}
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border bg-muted p-2">
            <File className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-medium">
                {attachedFile.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={uploadFileMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAttachmentClick}
            disabled={uploadFileMutation.isPending || !isConnected}
          >
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
              disabled={
                !isConnected || isLoading || uploadFileMutation.isPending
              }
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={
              (!message.trim() && !attachedFile) ||
              !isConnected ||
              isLoading ||
              uploadFileMutation.isPending
            }
          >
            {uploadFileMutation.isPending ? (
              <span className="h-4 w-4">⏳</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
