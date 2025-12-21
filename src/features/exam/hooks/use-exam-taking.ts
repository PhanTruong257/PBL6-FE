import { useState, useEffect, useCallback, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SubmissionService } from '../api'
import type {
  StartExamResponse,
  ExamQuestion,
  GetQuestionByOrderResponse,
} from '@/types/submission'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

interface UseExamTakingProps {
  examId: number
  password?: string
}

interface UseExamTakingReturn {
  // State
  submission: StartExamResponse | null
  currentQuestion: ExamQuestion | null
  currentAnswer: string
  isLoading: boolean
  isSavingAnswer: boolean
  isSubmittingExam: boolean
  remainingTime: number
  passwordRequired: boolean
  passwordError: string | null
  isVerifyingPassword: boolean
  
  // Actions
  setCurrentAnswer: (answer: string) => void
  goToQuestion: (order: number) => void
  goToNextQuestion: () => void
  goToPrevQuestion: () => void
  saveAnswer: (silent?: boolean) => void
  submitExam: () => void
  verifyPassword: (password: string) => Promise<boolean>
  
  // Computed
  canGoNext: boolean
  canGoPrev: boolean
}

const TIME_SYNC_INTERVAL = 5000

export function useExamTaking({ examId, password }: UseExamTakingProps): UseExamTakingReturn {
  const queryClient = useQueryClient()
  const [currentQuestionOrder, setCurrentQuestionOrder] = useState(1)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [remainingTime, setRemainingTime] = useState(0)
  const [passwordRequired, setPasswordRequired] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false)
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [examHasPassword, setExamHasPassword] = useState<boolean | null>(null)
  const remainingTimeRef = useRef(0) // Store latest remainingTime value
  const lastSyncTimeRef = useRef<number>(Date.now())
  const timeSyncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitializedQuestionOrder = useRef(false)
  const hasCheckedPassword = useRef(false)
  const navigate = useNavigate()
  
  // Check if exam requires password on mount
  useEffect(() => {
    const checkExamPassword = async () => {
      if (hasCheckedPassword.current) return
      hasCheckedPassword.current = true
      
      try {
        // Try to verify with empty password to check if exam has password
        const result = await SubmissionService.verifyExamPassword(examId, { password: '' })
        
        if (result.has_password) {
          // Exam requires password
          setExamHasPassword(true)
          setPasswordRequired(true)
          setIsPasswordVerified(false)
        } else {
          // Exam doesn't require password
          setExamHasPassword(false)
          setPasswordRequired(false)
          setIsPasswordVerified(true)
        }
      } catch (error) {
        console.error('Failed to check exam password requirement:', error)
        // On error, assume no password required and let backend handle it
        setExamHasPassword(false)
        setPasswordRequired(false)
        setIsPasswordVerified(true)
      }
    }
    
    checkExamPassword()
  }, [examId])
  
  // Start exam query - only enabled after password is verified
  const {
    data: submission,
    isLoading: isStartingExam,
    error: startExamError,
  } = useQuery({
    queryKey: ['exam-submission', examId, password],
    queryFn: () => SubmissionService.startExam(examId, password),
    enabled: isPasswordVerified && examHasPassword !== null,
    refetchOnWindowFocus: false,
    retry: false,
  })
  
  // Handle start exam errors
  useEffect(() => {
    if (startExamError) {
      const error = startExamError as any
      const errorMessage = error?.response?.data?.message || ''
      
      if (error?.response?.status === 400 && errorMessage.includes('password')) {
        // Password error from backend
        setPasswordRequired(true)
        setIsPasswordVerified(false)
        setPasswordError('Mật khẩu không chính xác')
      }
    }
  }, [startExamError])
  
  // Verify password function
  const verifyPassword = useCallback(async (pwd: string): Promise<boolean> => {
    setIsVerifyingPassword(true)
    setPasswordError(null)
    
    try {
      const result = await SubmissionService.verifyExamPassword(examId, { password: pwd })
      
      if (result.success) {
        setIsPasswordVerified(true)
        setPasswordRequired(false)
        setPasswordError(null)
        return true
      } else {
        setPasswordError(result.message || 'Mật khẩu không chính xác')
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Không thể xác thực mật khẩu'
      setPasswordError(errorMessage)
      return false
    } finally {
      setIsVerifyingPassword(false)
    }
  }, [examId])

    // Initialize current question order from API response
  useEffect(() => {
    if (submission?.current_question_order && !hasInitializedQuestionOrder.current) {
      setCurrentQuestionOrder(submission.current_question_order)
      hasInitializedQuestionOrder.current = true
    }
  }, [submission?.current_question_order])

  // Get current question
  const {
    data: questionData,
    isLoading: isLoadingQuestion,
  } = useQuery({
    queryKey: ['exam-question', submission?.submission_id, currentQuestionOrder],
    queryFn: () =>
      SubmissionService.getQuestionByOrder(
        submission!.submission_id,
        currentQuestionOrder
      ),
    enabled: !!submission?.submission_id,
    refetchOnWindowFocus: false,
  })

  // Initialize remaining time when submission starts
  useEffect(() => {
    if (submission?.remaining_time) {
      setRemainingTime(submission.remaining_time)
      remainingTimeRef.current = submission.remaining_time // Also update ref
      lastSyncTimeRef.current = Date.now()
    }
  }, [submission?.remaining_time])

  // Update current answer when question data changes
  useEffect(() => {
    if (questionData?.existing_answer?.answer_content) {
      setCurrentAnswer(questionData.existing_answer.answer_content.toString())
    } else {
      setCurrentAnswer('')
    }
  }, [questionData])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          // Auto-submit exam when time runs out
          if (submission?.submission_id) {
            submitExamMutation.mutate(submission.submission_id)
          }
          return 0
        }
        const newTime = prev - 1
        remainingTimeRef.current = newTime // Update ref with latest value
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [submission?.submission_id])

  // Sync remaining time with backend every 15 seconds
  useEffect(() => {
    if (!submission?.submission_id) return

    const syncTime = async () => {
      const currentRemainingTime = remainingTimeRef.current
      try {
        console.log('Syncing remaining time:', currentRemainingTime)
        await SubmissionService.updateRemainingTime(submission.submission_id, {
          remaining_time: currentRemainingTime,
        })
        console.log('Time sync successful')
      } catch (error) {
        console.error('Failed to sync time:', error)
      }
    }
    
    console.log('Setting up time sync interval...')
    // Start interval
    timeSyncIntervalRef.current = setInterval(syncTime, TIME_SYNC_INTERVAL)

    // Cleanup
    return () => {
      console.log('Cleaning up time sync interval')
      if (timeSyncIntervalRef.current) {
        clearInterval(timeSyncIntervalRef.current)
      }
    }
  }, [submission?.submission_id]) // Only depend on submission_id, not remainingTime

  // Save answer mutation
  const saveAnswerMutation = useMutation({
    mutationFn: async (_options?: { silent?: boolean }) => {
      if (!submission?.submission_id || !questionData?.question?.question_id) {
        throw new Error('Invalid submission or question')
      }

      let answer: any = currentAnswer

      if (typeof answer === 'string') {
        const trimmed = answer.trim()

        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) {
            answer = parsed.map(Number)
          }
        }
      }

      return SubmissionService.submitAnswer(submission.submission_id, {
        question_id: questionData.question.question_id,
        answer_content: JSON.stringify(answer), // <-- khuyến nghị
      })
    },
    onSuccess: (data, variables) => {
      // Only show toast if not silent save
      if (!variables?.silent) {
        toast.success('Câu trả lời đã được lưu')
      }
      
      // Update cache immediately instead of invalidating to avoid refetch delay
      queryClient.setQueryData(
        ['exam-question', submission?.submission_id, currentQuestionOrder],
        (oldData: GetQuestionByOrderResponse | undefined) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            existing_answer: {
              answer_id: data.answer_id,
              answer_content: currentAnswer.toString(),
            }
          }
        }
      )
    },
    onError: (error: any, variables) => {
      // Only show toast if not silent save
      if (!variables?.silent) {
        toast.error(error?.response?.data?.message || 'Không thể lưu câu trả lời')
      }
    },
  })

  // Submit exam mutation
  const submitExamMutation = useMutation({
    mutationFn: (submissionId: number) => {
      return SubmissionService.submitExam(submissionId)
    },
    onSuccess: () => {
      toast.success('Bài thi đã được nộp thành công!')
      navigate({ to: '/exam/student' })
      // Clear intervals
      if (timeSyncIntervalRef.current) {
        clearInterval(timeSyncIntervalRef.current)
      }
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['exam-submission', examId],
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Không thể nộp bài thi')
    },
  })

  // Navigation functions
  const goToQuestion = useCallback((order: number) => {
    if (!submission) return
    
    if (order >= 1 && order <= submission.total_questions) {
      setCurrentQuestionOrder(order)
    }
  }, [submission])

  const goToNextQuestion = useCallback(() => {
    if (!submission) return
    
    if (currentQuestionOrder < submission.total_questions) {
      setCurrentQuestionOrder((prev) => prev + 1)
    }
  }, [submission, currentQuestionOrder])

  const goToPrevQuestion = useCallback(() => {
    if (currentQuestionOrder > 1) {
      setCurrentQuestionOrder((prev) => prev - 1)
    }
  }, [currentQuestionOrder])

  const saveAnswer = useCallback((silent: boolean = false) => {
    saveAnswerMutation.mutate({ silent })
  }, [saveAnswerMutation])

  const submitExam = useCallback(() => {
    if (!submission?.submission_id) return
    
    // Confirm before submitting
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn nộp bài thi? Bạn sẽ không thể chỉnh sửa sau khi nộp.'
    )
    
    if (confirmed) {
      submitExamMutation.mutate(submission.submission_id)
    }
  }, [submission, submitExamMutation])

  const isLoading = isStartingExam || isLoadingQuestion
  const canGoNext = !!submission && currentQuestionOrder < submission.total_questions
  const canGoPrev = currentQuestionOrder > 1

  return {
    // State
    submission: submission || null,
    currentQuestion: questionData?.question || null,
    currentAnswer,
    isLoading,
    isSavingAnswer: saveAnswerMutation.isPending,
    isSubmittingExam: submitExamMutation.isPending,
    remainingTime,
    passwordRequired,
    passwordError,
    isVerifyingPassword,
    
    // Actions
    setCurrentAnswer,
    goToQuestion,
    goToNextQuestion,
    goToPrevQuestion,
    saveAnswer,
    submitExam,
    verifyPassword,
    
    // Computed
    canGoNext,
    canGoPrev,
  }
}
