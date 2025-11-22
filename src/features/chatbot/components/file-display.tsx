import { Button } from '@/components/ui/button'
import { X, File, FileText, Image, Video, Music } from 'lucide-react'
import type { UploadedFile } from '../types'

interface FileDisplayProps {
  files: UploadedFile[]
  onRemoveFile: (fileId: string) => void
  isFileVisibility:boolean
  disabled?: boolean
}

export function FileDisplay({ files, onRemoveFile, isFileVisibility=true, disabled = false }: FileDisplayProps) {
  if (files.length === 0) return null

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4 text-green-600" />
    if (fileType.startsWith('video/')) return <Video className="h-4 w-4 text-purple-600" />
    if (fileType.startsWith('audio/')) return <Music className="h-4 w-4 text-pink-600" />
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-4 w-4 text-red-600" />
    return <File className="h-4 w-4 text-blue-600" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    isFileVisibility &&

    <>
    <div className="p-3 bg-gray-50 rounded-lg border">
      <div className="text-xs font-medium text-gray-700 mb-2">
        Attached Files ({files.length})
      </div>
      <div className="space-y-2">

        {files.map((file) => (
          <div 
            key={file.id} 
            className="flex items-center justify-between p-2 bg-white rounded border"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </div>
              </div>
            </div>
            
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(file.id)}
                className="h-6 w-6 p-0 hover:bg-red-100 text-gray-400 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
      
  )
}