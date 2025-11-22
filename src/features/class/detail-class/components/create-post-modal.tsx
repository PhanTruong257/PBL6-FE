import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  AtSign,
  Hash,
  MoreHorizontal,
  Paperclip,
  Smile,
  X,
  FileText,
} from 'lucide-react'
import { AvatarHoverCard } from './avatar-hover-card'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { cookieStorage } from '@/libs/utils/cookie'
import { uploadMaterials } from '../hooks/use-class-detail'

interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  classInfo: {
    class_id: number
    class_name: string
  }
  onPostCreated?: () => void
}

export function CreatePostModal({
  isOpen,
  onOpenChange,
  classInfo,
  onPostCreated,
}: CreatePostModalProps) {
  const user = useRecoilValue(currentUserState)

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    // Allow submission if either message exists OR files are attached
    if ((!message.trim() && uploadedFiles.length === 0) || !user) {
      alert('Please enter a message or attach files')
      return
    }

    setIsUploading(true)

    const accessToken = cookieStorage.getAccessToken()
    const refreshToken = cookieStorage.getRefreshToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
    if (refreshToken) {
      headers['x-refresh-token'] = refreshToken
    }

    try {
      // First create the post
      const postMessage =
        message.trim() ||
        (uploadedFiles.length > 0
          ? `Uploaded ${uploadedFiles.length} file(s)`
          : '')
      const postTitle = title.trim() || ''

      const requestBody: any = {
        class_id: classInfo.class_id,
        message: postMessage,
        title: postTitle,
        sender_id: user.user_id,
      }

      // Don't send parent_id for main posts (only for replies)
      // Backend Transform will fail if we send null or undefined
      // Make sure the field is not in the object at all

      console.log(
        'Creating post with data:',
        JSON.stringify(requestBody, null, 2),
      )

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/classes/add-new-post`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        },
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('Failed to create post:', {
          status: res.status,
          statusText: res.statusText,
          error: errorData,
        })
        throw new Error(
          `Failed to create post: ${res.status} ${res.statusText}`,
        )
      }

      const json = await res.json()
      const newPostId = json.data.id

      // If there are files, upload them
      if (uploadedFiles.length > 0) {
        const uploadResult = await uploadMaterials(
          classInfo.class_id,
          uploadedFiles,
          user.user_id,
          title || message || 'File attachment',
          newPostId,
        )
        console.log('Upload materials result:', uploadResult)
      }

      console.log('Create post result:', json)

      setTitle('')
      setMessage('')
      setUploadedFiles([])

      // Wait for materials to be saved before closing
      if (uploadedFiles.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Trigger refresh
      if (onPostCreated) {
        onPostCreated()
      }

      onOpenChange(false)
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenFileModal = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      // Add file to state with uploading status

      setUploadedFiles((prev) => [...prev, file])
    }

    // Reset input
    if (event.target) {
      event.target.value = ''
    }
  }

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== fileToRemove))
  }

  const handleClose = () => {
    setTitle('')
    setMessage('')
    setUploadedFiles([])
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-lg">
        <DialogHeader className="p-4 pb-0 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {user && (
                <AvatarHoverCard
                  user={user}
                  placeHolder="/placeholder-avatar.jpg"
                />
              )}
              <div>
                <DialogTitle className="text-lg font-medium">
                  {user?.full_name || 'Unknown User'}
                </DialogTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-gray-100"
            ></Button>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-3">
          {/* Subject Input */}
          <div>
            <Input
              placeholder="Add a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-base border-0 border-b border-gray-200 rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-gray-400 bg-transparent"
              disabled={isUploading}
            />
          </div>

          {/* Content Textarea */}
          <div className="min-h-[100px]">
            <Textarea
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] border-0 resize-none p-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
              disabled={isUploading}
            />
          </div>

          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">
                Attached Files:
              </div>
              {uploadedFiles.map((uploadedFile, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {uploadedFile.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="*/*"
        />

        {/* Footer with actions */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              onClick={handleOpenFileModal}
              disabled={isUploading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              disabled={isUploading}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              disabled={isUploading}
            >
              <AtSign className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              disabled={isUploading}
            >
              <Hash className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-200"
              disabled={isUploading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              isUploading || (!message.trim() && uploadedFiles.length === 0)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isUploading ? '⏳' : 'Post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
