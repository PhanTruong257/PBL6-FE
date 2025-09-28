import type { LessonFilters, Lesson } from '../types'

export const filterLessons = (lessons: Lesson[], filters: LessonFilters): Lesson[] => {
  return lessons.filter(lesson => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const matchesSearch = 
        lesson.title.toLowerCase().includes(searchTerm) ||
        lesson.description.toLowerCase().includes(searchTerm) ||
        lesson.courseName.toLowerCase().includes(searchTerm)
      
      if (!matchesSearch) return false
    }
    
    // Course filter
    if (filters.courseId && lesson.courseId !== filters.courseId) {
      return false
    }
    
    // Published status filter
    if (filters.isPublished !== undefined && lesson.isPublished !== filters.isPublished) {
      return false
    }
    
    return true
  })
}

export const getFilterLabel = (key: keyof LessonFilters, value: string | boolean | undefined): string => {
  switch (key) {
    case 'isPublished':
      return value ? 'Đã xuất bản' : 'Bản nháp'
    case 'courseId':
      return `Khóa học: ${value}`
    case 'search':
      return `Tìm kiếm: "${value}"`
    default:
      return String(value)
  }
}

export const buildFilterSummary = (filters: LessonFilters): string[] => {
  const summary: string[] = []
  
  if (filters.search) {
    summary.push(`Tìm kiếm: "${filters.search}"`)
  }
  
  if (filters.courseId) {
    summary.push(`Khóa học được chọn`)
  }
  
  if (filters.isPublished !== undefined) {
    summary.push(filters.isPublished ? 'Đã xuất bản' : 'Bản nháp')
  }
  
  return summary
}