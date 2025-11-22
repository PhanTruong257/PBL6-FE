import {
  AtSign,
  Hash,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
  X,
  File,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useRef } from 'react'
import type { PostCardProps } from '../types'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { useCreatePost, useUploadMaterials } from '../hooks/use-class-detail'

interface ReplyInputProps {
  classId: number
  postId: number
  replies: PostCardProps[]
  onReplyAdded?: () => void
}

export function replyInput({
  classId,
  postId,
  replies,
  onReplyAdded,
}: ReplyInputProps) {
  const [reply, setReply] = useState<string>('')
  const [hideReplyInput, setHideReplyInput] = useState<boolean>(true)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const user = useRecoilValue(currentUserState)
  const createPostMutation = useCreatePost()
  const uploadMaterialsMutation = useUploadMaterials()

  const isSubmitting =
    createPostMutation.isPending || uploadMaterialsMutation.isPending

  const sendReplyHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if ((!reply?.trim() && attachedFiles.length === 0) || !user) return

    try {
      // First create the reply post
      const result = await createPostMutation.mutateAsync({
        class_id: classId,
        parent_id: postId,
        message: reply || `Uploaded ${attachedFiles.length} file(s)`,
        title: '',
        sender_id: user.user_id,
      })

      const newPostId = result.data.id
      console.log('Add reply result:', result)

      // If there are files, upload them
      if (attachedFiles.length > 0) {
        const uploadResult = await uploadMaterialsMutation.mutateAsync({
          classId: classId,
          files: attachedFiles,
          uploaderId: user.user_id,
          title: reply || 'File attachment',
          postId: newPostId,
        })
        console.log('Upload materials result:', uploadResult)
      }

      setReply('')
      setAttachedFiles([])
      setHideReplyInput(true)

      // Wait for materials to be saved before refreshing
      if (attachedFiles.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Always refresh to get updated materials (mutations already invalidate queries)
      if (onReplyAdded) {
        onReplyAdded()
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      alert('Failed to add reply. Please try again.')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Check total file size
      const totalSize = files.reduce((sum, file) => sum + file.size, 0)
      if (totalSize > 50 * 1024 * 1024) {
        alert('Total file size must be less than 50MB')
        return
      }
      setAttachedFiles((prev) => [...prev, ...files])
    }
    // Reset input để có thể chọn lại cùng file
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleCancel = () => {
    setReply('')
    setAttachedFiles([])
    setHideReplyInput(true)
  }

  return hideReplyInput ? (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-gray-900"
      onClick={() => setHideReplyInput(!hideReplyInput)}
    >
      <MessageCircle className="h-4 w-4 mr-1" />
      Reply
    </Button>
  ) : (
    <div className="w-full space-y-2">
      {/* File attachments preview */}
      {attachedFiles.length > 0 && (
        <div className="space-y-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">
              Attached Files ({attachedFiles.length})
            </span>
          </div>
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg border bg-white"
            >
              <File className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                disabled={isSubmitting}
                className="hover:bg-red-50"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center w-full">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Type a new message"
            className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            onBlur={(e) => {
              // Don't hide if:
              // 1. Clicking on buttons or file input
              // 2. Have attached files
              const relatedTarget = e.relatedTarget as HTMLElement
              const hasFiles = attachedFiles.length > 0
              if (hasFiles) return // Keep open if files attached
              if (!relatedTarget || !relatedTarget.closest('.reply-actions')) {
                setHideReplyInput(true)
              }
            }}
            onKeyDown={(e) => {
              // Send on Enter key press
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (
                  !isSubmitting &&
                  (reply.trim() || attachedFiles.length > 0)
                ) {
                  sendReplyHandler(e as any)
                }
              }
            }}
            onChange={(e) => setReply(e.target.value)}
            value={reply}
            disabled={isSubmitting}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 reply-actions">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAttachmentClick()
              }}
              disabled={isSubmitting}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              <AtSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              <Hash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
              onClick={(e) => e.preventDefault()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 reply-actions"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            sendReplyHandler(e)
          }}
          disabled={
            isSubmitting || (!reply.trim() && attachedFiles.length === 0)
          }
        >
          {isSubmitting ? (
            <span className="h-4 w-4">⏳</span>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-gray-500 hover:text-gray-700 reply-actions"
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleCancel()
          }}
          disabled={isSubmitting}
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
