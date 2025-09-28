import { api } from '@/services/api/client'
import type { LessonFilters, CreateLessonData, UpdateLessonData } from '../types'

export const lessonsApi = {
  // Get all lessons with filters
  getLessons: async (filters: LessonFilters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.search) params.append('search', filters.search)
    if (filters.courseId) params.append('courseId', filters.courseId)
    if (filters.isPublished !== undefined) params.append('isPublished', String(filters.isPublished))
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    const response = await api.get(`/teacher/lessons?${params.toString()}`)
    return response.data
  },

  // Get lesson by ID
  getLesson: async (id: string) => {
    const response = await api.get(`/teacher/lessons/${id}`)
    return response.data
  },

  // Create new lesson
  createLesson: async (data: CreateLessonData) => {
    const response = await api.post('/teacher/lessons', data)
    return response.data
  },

  // Update lesson
  updateLesson: async (id: string, data: UpdateLessonData) => {
    const response = await api.put(`/teacher/lessons/${id}`, data)
    return response.data
  },

  // Delete lesson
  deleteLesson: async (id: string) => {
    const response = await api.delete(`/teacher/lessons/${id}`)
    return response.data
  },

  // Publish/Unpublish lesson
  togglePublish: async (id: string, isPublished: boolean) => {
    const response = await api.patch(`/teacher/lessons/${id}/publish`, { isPublished })
    return response.data
  },

  // Reorder lessons
  reorderLessons: async (lessons: { id: string; order: number }[]) => {
    const response = await api.patch('/teacher/lessons/reorder', { lessons })
    return response.data
  }
}