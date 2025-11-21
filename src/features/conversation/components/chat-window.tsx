import { useState, useRef, useEffect } from 'react'
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
import { useGlobalSocket } from '@/global/providers/socket-provider'
import { useRealtimeChat } from '../hooks/useRealtimeChat'
import { MessageType } from '../types/socket-events'
import { ConversationService } from '../api/conversation-service'
import { uploadChatFile, downloadChatFile } from '../api/chat-files'
import type { ConversationWithUser } from '../types'

interface ChatWindowProps {
  conversation?: ConversationWithUser
  currentUserId: number
}

export function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
  const [message, setMessage] = useState('')
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { socket, isConnected } = useGlobalSocket()

  // Use real-time chat hook
  const { messages, sendMessage, markAsRead, isLoading } = useRealtimeChat({
    socket,
    conversationId: conversation?.id || 0,
    userId: currentUserId,
    enabled: !!conversation,
  })

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (!conversation?.id) return

    console.log('📖 [CHAT_WINDOW] Conversation opened, marking as read...')

    // Call REST API to mark all unread messages as read in the database
    ConversationService.markAsRead(conversation.id)
      .then((response) => {
        console.log('✅ Marked conversation as read via API:', response)
      })
      .catch((error) => {
        console.error('❌ Failed to mark as read:', error)
      })
  }, [conversation?.id])

  // Also mark as read when new messages arrive from others
  useEffect(() => {
    if (!conversation?.id || messages.length === 0) return

    const lastMessage = messages[messages.length - 1]

    // Only mark as read if the last message is from someone else
    if (lastMessage && lastMessage.sender_id !== currentUserId) {
      console.log(
        '📖 [CHAT_WINDOW] New message from other user, marking as read...',
      )

      ConversationService.markAsRead(conversation.id)
        .then(() => {
          console.log('✅ Marked new messages as read')
          // Also emit socket event for real-time update
          markAsRead(lastMessage.id)
        })
        .catch((error) => {
          console.error('❌ Failed to mark as read:', error)
        })
    }
  }, [messages.length, conversation?.id, currentUserId, markAsRead])

  const handleSendMessage = async () => {
    if ((!message.trim() && !attachedFile) || !conversation) return

    try {
      setIsUploading(true)

      // If there's a file, upload it first
      if (attachedFile) {
        const uploadResult = await uploadChatFile(attachedFile)

        // Send message with file attachment
        sendMessage(message.trim() || attachedFile.name, MessageType.file, {
          file_url: uploadResult.file_url,
          file_name: uploadResult.file_name,
          file_size: uploadResult.file_size,
        })

        setAttachedFile(null)
      } else {
        // Send regular text message
        sendMessage(message.trim(), MessageType.text)
      }

      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB')
        return
      }
      setAttachedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
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
            <div className="font-semibold">
              {conversation.receiver_name || 'Người dùng'}
            </div>
            <div className="text-xs text-muted-foreground">
              {isConnected ? (
                <span className="text-green-600">● Online</span>
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
                            onClick={async () => {
                              try {
                                console.log('📥 Download file:', {
                                  file_url: msg.file_url,
                                  file_name: msg.file_name,
                                  file_size: msg.file_size,
                                })

                                // Extract filename from file_url (/chats/download/filename.ext)
                                const urlParts = msg.file_url.split('/')
                                const filenameFromUrl =
                                  urlParts[urlParts.length - 1]

                                console.log(
                                  '📥 Extracted filename:',
                                  filenameFromUrl,
                                )

                                // Use file_name if available, otherwise extract from URL
                                const displayName =
                                  msg.file_name || filenameFromUrl || 'download'

                                console.log(
                                  '📥 Downloading file:',
                                  filenameFromUrl,
                                )
                                const blob =
                                  await downloadChatFile(filenameFromUrl)
                                console.log(
                                  '📥 Blob received:',
                                  blob.size,
                                  'bytes',
                                )

                                const url = window.URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = displayName
                                a.click()
                                window.URL.revokeObjectURL(url)
                                console.log('✅ Download triggered')
                              } catch (error) {
                                console.error(
                                  '❌ Failed to download file:',
                                  error,
                                )
                                alert('Không thể tải file. Vui lòng thử lại!')
                              }
                            }}
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
              disabled={isUploading}
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
            disabled={isUploading || !isConnected}
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
              disabled={!isConnected || isLoading || isUploading}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={
              (!message.trim() && !attachedFile) ||
              !isConnected ||
              isLoading ||
              isUploading
            }
          >
            {isUploading ? (
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
