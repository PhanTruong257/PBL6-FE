import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getSubmissionById, updateAnswerGrades } from '../api/submissions'

interface AnswerEdit {
  answer_id: number
  points_earned?: string
  comment?: string
}

// Toggle this to use mock API instead of real API
const USE_MOCK_API = true

/**
 * Hook to manage submission detail view
 */
export function useSubmissionDetail(
  submissionId: string | undefined,
  examId: string | undefined
) {
  const navigate = useNavigate()

  // Track edited answers (points and comments)
  const [editedAnswers, setEditedAnswers] = useState<Record<number, AnswerEdit>>({})
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch submission detail
  const { data: submission, isLoading, error, refetch } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => getSubmissionById(Number(submissionId)),
    enabled: !!submissionId,
  })

  // Mock API mutation for updating submission grades
  const updateGradesMutation = useMutation({
    mutationFn: async (data: { submissionId: number; answers: AnswerEdit[] }) => {
      if (USE_MOCK_API) {
        // Mock implementation (for testing)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Mock: Submitting grades for submission:', data.submissionId)
        console.log('Mock: Updated answers:', data.answers)
        return { success: true, data: {} } as any
      } else {
        // Use the actual API call
        // Note: The API endpoint might need adjustment based on your backend implementation
        return updateAnswerGrades(data.submissionId, data.answers)
      }
    },
    onSuccess: () => {
      // Navigate back to submissions list after successful update
      if (examId) {
        navigate({
          to: '/exam/$examId/submissions/',
          params: { examId: String(examId) },
        } as any)
      } else {
        navigate({ to: '/exam/' } as any)
      }
    },
  })

  // Navigate back to submissions list or exam list
  const handleBack = () => {
    if (examId) {
      navigate({
        to: '/exam/$examId/submissions/',
        params: { examId: String(examId) },
      } as any)
    } else {
      navigate({ to: '/exam/' } as any)
    }
  }

  // Start editing an answer
  const handleEditAnswer = (answerId: number, currentPoints: string, currentComment?: string) => {
    setEditingAnswerId(answerId)
    if (!editedAnswers[answerId]) {
      setEditedAnswers(prev => ({
        ...prev,
        [answerId]: {
          answer_id: answerId,
          points_earned: currentPoints,
          comment: currentComment,
        }
      }))
    }
  }

  // Update points for an answer
  const handleUpdatePoints = (answerId: number, points: string) => {
    setEditedAnswers(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        answer_id: answerId,
        points_earned: points,
      }
    }))
  }

  // Update comment for an answer
  const handleUpdateComment = (answerId: number, comment: string) => {
    setEditedAnswers(prev => ({
      ...prev,
      [answerId]: {
        ...prev[answerId],
        answer_id: answerId,
        comment: comment,
      }
    }))
  }

  // Save the current answer being edited
  const handleSaveAnswer = () => {
    setEditingAnswerId(null)
  }

  // Cancel editing the current answer
  const handleCancelEdit = (answerId: number) => {
    setEditingAnswerId(null)
    // Remove from edited answers if it was just added
    const newEditedAnswers = { ...editedAnswers }
    delete newEditedAnswers[answerId]
    setEditedAnswers(newEditedAnswers)
  }

  // Submit all changes
  const handleSubmitGrades = async () => {
    if (!submissionId || Object.keys(editedAnswers).length === 0) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const answersToUpdate = Object.values(editedAnswers)
      await updateGradesMutation.mutateAsync({
        submissionId: Number(submissionId),
        answers: answersToUpdate,
      })
    } catch (error) {
      console.error('Error submitting grades:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Check if answer has been edited
  const isAnswerEdited = (answerId: number) => {
    return answerId in editedAnswers
  }

  // Get current value for an answer (edited or original)
  const getAnswerValue = (answerId: number, field: 'points_earned' | 'comment', originalValue: any) => {
    if (editedAnswers[answerId] && editedAnswers[answerId][field] !== undefined) {
      return editedAnswers[answerId][field]
    }
    return originalValue
  }

  return {
    // Data
    submission,
    editedAnswers,
    editingAnswerId,
    
    // Loading states
    isLoading,
    isSubmitting,
    error,
    
    // Computed
    hasEdits: Object.keys(editedAnswers).length > 0,
    
    // Actions
    refetch,
    handleBack,
    handleEditAnswer,
    handleUpdatePoints,
    handleUpdateComment,
    handleSaveAnswer,
    handleCancelEdit,
    handleSubmitGrades,
    isAnswerEdited,
    getAnswerValue,
  }
}
