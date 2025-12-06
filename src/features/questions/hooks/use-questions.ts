import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/libs/toast'
import { questionsApi, categoriesApi } from '../apis'
import type {
  QuestionFilterParams,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateQuestionCategoryRequest,
  UpdateQuestionCategoryRequest,
} from '@/types/question'

// ==================== CATEGORIES ====================
export const useCategories = () => {
  return useQuery({
    queryKey: ['question-categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data
    },
  })
}

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['question-categories', id],
    queryFn: async () => {
      const response = await categoriesApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionCategoryRequest) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category')
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuestionCategoryRequest }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Category updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category')
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    },
  })
}

// ==================== QUESTIONS ====================

export const useQuestions = (params?: QuestionFilterParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: async () => {
      const response = await questionsApi.getAll(params)
      return response.data
    },
  })
}

export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: ['questions', id],
    queryFn: async () => {
      const response = await questionsApi.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      toast.success('Question created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create question')
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuestionRequest }) =>
      questionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      toast.success('Question updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update question')
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      toast.success('Question deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete question')
    },
  })
}
