import { useState, useRef, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { uploadChatFile, downloadChatFile } from '../api/chat-files'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

/**
 * Unified hook for file operations and message formatting
 * Combines: useChatFile + useMessageFormatter
 */
export function useChatUtils() {
  // File management
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFileMutation = useMutation({
    mutationFn: (file: File) => uploadChatFile(file),
  })

  const downloadFileMutation = useMutation({
    mutationFn: (filename: string) => downloadChatFile(filename),
  })

  // File handlers
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (file.size > MAX_FILE_SIZE) {
        alert('File size must be less than 50MB')
        return
      }
      setAttachedFile(file)
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

  const uploadFile = useCallback(
    async (file: File) => {
      return await uploadFileMutation.mutateAsync(file)
    },
    [uploadFileMutation],
  )

  const downloadFile = useCallback(
    async (fileUrl: string, fileName?: string, _fileSize?: number) => {
      try {
        const urlParts = fileUrl.split('/')
        const filenameFromUrl = urlParts[urlParts.length - 1]
        const displayName = fileName || filenameFromUrl || 'download'

        const blob = await downloadFileMutation.mutateAsync(filenameFromUrl)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = displayName
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        alert('Không thể tải file. Vui lòng thử lại!')
      }
    },
    [downloadFileMutation],
  )

  // Date/time formatters
  const formatTime = useCallback((timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  const formatDate = useCallback((timestamp: string) => {
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
  }, [])

  const formatRelativeTime = useCallback((timestamp: string) => {
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
  }, [])

  return {
    // File operations
    attachedFile,
    fileInputRef,
    uploadFileMutation,
    downloadFileMutation,
    handleFileSelect,
    handleRemoveFile,
    handleAttachmentClick,
    uploadFile,
    downloadFile,
    setAttachedFile,
    // Formatters
    formatTime,
    formatDate,
    formatRelativeTime,
  }
}
