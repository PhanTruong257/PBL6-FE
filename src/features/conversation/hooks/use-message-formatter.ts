import { useCallback } from 'react'

/**
 * Hook to format dates and times for messages
 */
export function useMessageFormatter() {
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
    formatTime,
    formatDate,
    formatRelativeTime,
  }
}
