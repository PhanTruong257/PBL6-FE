import type { Lesson } from '../types'

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} giờ`
  }
  
  return `${hours} giờ ${remainingMinutes} phút`
}

export const getStatusColor = (isPublished: boolean): string => {
  return isPublished 
    ? 'bg-green-100 text-green-800 border-green-200' 
    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
}

export const getStatusText = (isPublished: boolean): string => {
  return isPublished ? 'Đã xuất bản' : 'Bản nháp'
}

export const sortLessons = (
  lessons: Lesson[], 
  sortBy: 'title' | 'duration' | 'createdAt' | 'viewCount', 
  sortOrder: 'asc' | 'desc'
): Lesson[] => {
  return [...lessons].sort((a, b) => {
    let compareValue = 0
    
    switch (sortBy) {
      case 'title':
        compareValue = a.title.localeCompare(b.title)
        break
      case 'duration':
        compareValue = a.duration - b.duration
        break
      case 'createdAt':
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      case 'viewCount':
        compareValue = a.viewCount - b.viewCount
        break
      default:
        compareValue = 0
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue
  })
}