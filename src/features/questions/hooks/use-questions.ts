import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
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
    queryFn: () => categoriesApi.getAll(),
  })
}

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['question-categories', id],
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateQuestionCategoryRequest) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast({
        title: 'Success',
        description: 'Category created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create category',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuestionCategoryRequest }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update category',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete category',
        variant: 'destructive',
      })
    },
  })
}

// ==================== QUESTIONS ====================

export const useQuestions = (params?: QuestionFilterParams) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionsApi.getAll(params),
  })
}

export const useQuestion = (id: number) => {
  return useQuery({
    queryKey: ['questions', id],
    queryFn: () => questionsApi.getById(id),
    enabled: !!id,
  })
}

export const useCreateQuestion = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      toast({
        title: 'Success',
        description: 'Question created successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create question',
        variant: 'destructive',
      })
    },
  })
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQuestionRequest }) =>
      questionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      toast({
        title: 'Success',
        description: 'Question updated successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update question',
        variant: 'destructive',
      })
    },
  })
}

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (id: number) => questionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
      queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      toast({
        title: 'Success',
        description: 'Question deleted successfully',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete question',
        variant: 'destructive',
      })
    },
  })
}
