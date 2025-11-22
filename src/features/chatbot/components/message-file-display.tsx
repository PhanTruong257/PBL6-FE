import { File, FileText, Image, Video, Music, Download } from 'lucide-react'
import type { UploadedFile } from '../types'

interface MessageFileDisplayProps {
  files: UploadedFile[]
  messageRole: 'user' | 'ai'
}

export function MessageFileDisplay({ files, messageRole }: MessageFileDisplayProps) {
  if (!files || files.length === 0) return null

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-3 w-3 text-green-600" />
    if (fileType.startsWith('video/')) return <Video className="h-3 w-3 text-purple-600" />
    if (fileType.startsWith('audio/')) return <Music className="h-3 w-3 text-pink-600" />
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-3 w-3 text-red-600" />
    return <File className="h-3 w-3 text-blue-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getImagePreview = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file.file)
      return (
        <img 
          src={imageUrl} 
          alt={file.name}
          className="max-w-xs max-h-32 rounded object-cover"
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      )
    }
    return null
  }

  return (
    <div className={`mb-2 max-w-[70%] ${messageRole === 'user' ? 'ml-auto' : 'mr-auto'}`}>
      <div className={`p-2 rounded-lg border ${
        messageRole === 'user' 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="text-xs font-medium text-gray-600 mb-2">
          📎 {files.length} file{files.length > 1 ? 's' : ''} attached
        </div>
        
        <div className="space-y-2">
          {files.map((file, index) => {
            const imagePreview = getImagePreview(file)
            
            return (
              <div key={index} className="space-y-1">
                {/* Image preview if it's an image */}
                {imagePreview && (
                  <div className="flex justify-center">
                    {imagePreview}
                  </div>
                )}
                
                {/* File info */}
                <div className={`flex items-center justify-between p-2 rounded border ${
                  messageRole === 'user' 
                    ? 'bg-white border-blue-300' 
                    : 'bg-white border-green-300'
                }`}>
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}