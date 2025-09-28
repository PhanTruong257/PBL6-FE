export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  price: number
  duration: number // in minutes
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  teacherId: string
  teacherName: string
  enrollmentCount: number
  rating: number
  reviewCount: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  duration: number // in minutes
  order: number
  isPreview: boolean
  createdAt: string
  updatedAt: string
}

export interface CourseEnrollment {
  id: string
  courseId: string
  studentId: string
  enrolledAt: string
  progress: number // 0-100
  completedLessons: string[]
  lastAccessedAt: string
}