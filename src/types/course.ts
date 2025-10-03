/**
 * Course-related types
 */

import type { User } from './user'

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'

export type CourseStatus = 'draft' | 'published' | 'archived'

export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  level: CourseLevel
  status: CourseStatus
  category: string
  tags: string[]
  duration: number // in minutes
  price: number
  discount?: number
  instructor: User
  enrolledCount: number
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
}

export interface CourseLesson {
  id: string
  courseId: string
  title: string
  description: string
  duration: number
  videoUrl?: string
  order: number
  isFree: boolean
  resources: LessonResource[]
}

export interface LessonResource {
  id: string
  lessonId: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'document'
  url: string
  size?: number
}

export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  progress: number // 0-100
  completedLessons: string[]
  lastAccessedAt: string
}
