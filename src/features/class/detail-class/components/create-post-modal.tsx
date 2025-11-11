import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AtSign, Hash, MoreHorizontal, Paperclip, Smile, X, FileText } from 'lucide-react'
import { mockClassInfo, mockUser } from '../mock-data'
import { AvatarHoverCard } from './avatar-hover-card'


interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePostModal({ isOpen, onOpenChange }: CreatePostModalProps) {

  const user=mockUser;
  const classInfo = mockClassInfo;

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFileToServer = async (): Promise<string> => {
    const formData = new FormData()
    for (let file of uploadedFiles) formData.append('files', file);
    formData.append('uploader_id', user.user_id.toString());
    formData.append('title', title);
    formData.append('message', message);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/classes/${classInfo.class_id}/upload-post-with-files`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      return result.url || result.path
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  const handleOpenFileModal = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (const file of Array.from(files)) {
      // Add file to state with uploading status
      
      
      setUploadedFiles(prev => [...prev, file])
    }

    // Reset input
    if (event.target) {
      event.target.value = ''
    }
  }

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileToRemove))
  }

  const handleSubmit = async () => {
    setTitle('')
    setMessage('')
    await uploadFileToServer();
    setUploadedFiles([])
    onOpenChange(false)
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
              <AvatarHoverCard user={user} placeHolder='/placeholder-avatar.jpg'/>
              <div>
                <DialogTitle className="text-lg font-medium">{user.full_name}</DialogTitle>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
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
            />
          </div>

          {/* Content Textarea */}
          <div className="min-h-[100px]">
            <Textarea
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] border-0 resize-none p-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
            />
          </div>

          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Attached Files:</div>
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadedFile)}
                    className="h-6 w-6 p-0 hover:bg-red-100"
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
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-200">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-200">
              <AtSign className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-200">
              <Hash className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-200">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!message.trim() && uploadedFiles.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}