import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonsApi } from '../services'
import type { LessonFilters, CreateLessonData, UpdateLessonData } from '../types'

// Query keys
const LESSONS_QUERY_KEY = 'teacher-lessons'

export const useLessons = (filters: LessonFilters = {}) => {
  return useQuery({
    queryKey: [LESSONS_QUERY_KEY, filters],
    queryFn: () => lessonsApi.getLessons(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useLesson = (id: string) => {
  return useQuery({
    queryKey: [LESSONS_QUERY_KEY, id],
    queryFn: () => lessonsApi.getLesson(id),
    enabled: !!id,
  })
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLessonData) => lessonsApi.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] })
    },
  })
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonData }) =>
      lessonsApi.updateLesson(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY, id] })
    },
  })
}

export const useDeleteLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => lessonsApi.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] })
    },
  })
}

export const useTogglePublishLesson = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      lessonsApi.togglePublish(id, isPublished),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY, id] })
    },
  })
}

export const useReorderLessons = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessons: { id: string; order: number }[]) =>
      lessonsApi.reorderLessons(lessons),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LESSONS_QUERY_KEY] })
    },
  })
}