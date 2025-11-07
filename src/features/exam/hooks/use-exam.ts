import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ExamService } from '../api'
import type {
  GetQuestionsQuery,
  GetExamsQuery,
  CreateExamRequest,
  UpdateExamRequest,
  ExamStatus,
} from '@/types/exam'

/**
 * Hook to fetch questions from the question bank
 */
export function useQuestions(query?: GetQuestionsQuery) {
  return useQuery({
    queryKey: ['questions', query],
    queryFn: () => ExamService.getQuestions(query),
  })
}

/**
 * Hook to fetch a single question by ID
 */
export function useQuestion(id: number) {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => ExamService.getQuestionById(id),
    enabled: !!id,
  })
}

/**
 * Hook to fetch exams
 */
export function useExams(query?: GetExamsQuery) {
  return useQuery({
    queryKey: ['exams', query],
    queryFn: () => ExamService.getExams(query),
  })
}

export function useClassNames() {
  return useQuery({
    queryKey: ['class-names'],
    queryFn: () => ExamService.getClassNameOptions(),
  })
}

/**
 * Hook to fetch a single exam by ID
 */
export function useExam(id: number) {
  return useQuery({
    queryKey: ['exam', id],
    queryFn: () => ExamService.getExamById(id),
    enabled: !!id,
  })
}

/**
 * Hook to create a new exam
 */
export function useCreateExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateExamRequest) => ExamService.createExam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

/**
 * Hook to update an existing exam
 */
export function useUpdateExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateExamRequest) => ExamService.updateExam(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      queryClient.invalidateQueries({ queryKey: ['exam', data.exam_id] })
    },
  })
}

/**
 * Hook to delete an exam
 */
export function useDeleteExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ExamService.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
    },
  })
}

/**
 * Hook to publish an exam
 */
export function usePublishExam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ExamService.publishExam(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      queryClient.invalidateQueries({ queryKey: ['exam', data.exam_id] })
    },
  })
}

/**
 * Hook to manage exam editing - fetches exam data and handles updates
 */
export function useEditExam(examId: number) {
  const queryClient = useQueryClient()

  // Fetch exam data
  const examQuery = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => ExamService.getExamById(examId),
    enabled: !!examId && !isNaN(examId),
  })

  // Update exam mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateExamRequest) => ExamService.updateExam(data),
    onSuccess: (updatedExam) => {
      toast.success('Cập nhật bài kiểm tra thành công!', {
        description: `Bài kiểm tra "${updatedExam.title}" đã được cập nhật.`,
      })
      queryClient.invalidateQueries({ queryKey: ['exams'] })
      queryClient.invalidateQueries({ queryKey: ['exam', examId] })
    },
    onError: (error: Error) => {
      toast.error('Cập nhật bài kiểm tra thất bại', {
        description: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      })
    },
  })

  const handleSubmit = async (data: {
    basicInfo: {
      class_id: number
      title: string
      description?: string
      duration?: number
      start_time: string
      end_time: string
      total_points?: number
      status?: ExamStatus
    }
    questions: Array<{ question_id: number; points: number; order: number }>
  }) => {
    const updateData: UpdateExamRequest = {
      exam_id: examId,
      class_id: data.basicInfo.class_id,
      title: data.basicInfo.title,
      description: data.basicInfo.description,
      duration: data.basicInfo.duration,
      start_time: data.basicInfo.start_time,
      end_time: data.basicInfo.end_time,
      total_points: data.basicInfo.total_points,
      status: data.basicInfo.status,
      questions: data.questions.map((q) => ({
        question_id: q.question_id,
        points: Number(q.points),
        order: q.order,
      })),
    }

    try {
      await updateMutation.mutateAsync(updateData)
      return true
    } catch {
      return false
    }
  }

  return {
    exam: examQuery.data,
    isLoading: examQuery.isLoading,
    error: examQuery.error,
    isSubmitting: updateMutation.isPending,
    handleSubmit,
  }
}
