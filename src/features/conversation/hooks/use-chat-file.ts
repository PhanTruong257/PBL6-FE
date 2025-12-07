import { useState, useRef, useCallback } from 'react'
import { useUploadChatFile, useDownloadChatFile } from './use-conversation'

/**
 * Hook to handle file upload/download in chat
 */
export function useChatFile() {
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFileMutation = useUploadChatFile()
  const downloadFileMutation = useDownloadChatFile()

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          alert('File size must be less than 50MB')
          return
        }
        setAttachedFile(file)
      }
    },
    [],
  )

  const handleRemoveFile = useCallback(() => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleAttachmentClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const downloadFile = useCallback(
    async (fileUrl: string, fileName?: string, fileSize?: number) => {
      try {
        console.log('📥 Download file:', {
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
        })

        const urlParts = fileUrl.split('/')
        const filenameFromUrl = urlParts[urlParts.length - 1]

        console.log('📥 Extracted filename:', filenameFromUrl)

        const displayName = fileName || filenameFromUrl || 'download'

        console.log('📥 Downloading file:', filenameFromUrl)
        const blob = await downloadFileMutation.mutateAsync(filenameFromUrl)
        console.log('📥 Blob received:', blob.size, 'bytes')

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = displayName
        a.click()
        window.URL.revokeObjectURL(url)
        console.log('✅ Download triggered')
      } catch (error) {
        console.error('❌ Failed to download file:', error)
        alert('Không thể tải file. Vui lòng thử lại!')
      }
    },
    [downloadFileMutation],
  )

  const uploadFile = useCallback(
    async (file: File) => {
      const uploadResult = await uploadFileMutation.mutateAsync(file)
      return uploadResult
    },
    [uploadFileMutation],
  )

  return {
    attachedFile,
    fileInputRef,
    uploadFileMutation,
    downloadFileMutation,
    handleFileSelect,
    handleRemoveFile,
    handleAttachmentClick,
    downloadFile,
    uploadFile,
    setAttachedFile,
  }
}
