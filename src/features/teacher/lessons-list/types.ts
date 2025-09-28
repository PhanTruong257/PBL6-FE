export interface Lesson {
  id: string
  title: string
  description: string
  duration: number // in minutes
  videoUrl?: string
  order: number
  courseId: string
  courseName: string
  isPublished: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface LessonFilters {
  search?: string
  courseId?: string
  isPublished?: boolean
  sortBy?: 'title' | 'duration' | 'createdAt' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateLessonData {
  title: string
  description: string
  courseId: string
  videoUrl?: string
  order: number
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  isPublished?: boolean
}