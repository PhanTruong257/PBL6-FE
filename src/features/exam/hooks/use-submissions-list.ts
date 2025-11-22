import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getSubmissionsByExam } from '../api/submissions'

/**
 * Hook to manage submissions list for an exam
 */
export function useSubmissionsList(examId: string | undefined) {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [limit] = useState(5)

  // Fetch submissions
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['submissions', examId, page, limit],
    queryFn: () => getSubmissionsByExam(Number(examId), { page, limit }),
    enabled: !!examId,
  })

  console.log("data in hook", data);

  // Navigate to submission detail
  const handleViewSubmission = (submissionId: number) => {
    navigate({
      to: '/exam/$examId/submissions/$submissionId',
      params: { examId: String(examId), submissionId: String(submissionId) },
    } as any)
  }

  // Navigate back to exam list
  const handleBack = () => {
    navigate({ to: '/exam/' } as any)
  }

  // Pagination helpers
  const goToNextPage = () => {
    if (data?.pagination) {
      setPage((p) => Math.min(data.pagination.totalPages, p + 1))
    }
  }

  const goToPreviousPage = () => {
    setPage((p) => Math.max(1, p - 1))
  }

  const canGoToNextPage = data?.pagination
    ? page < data.pagination.totalPages
    : false

  const canGoToPreviousPage = page > 1

  return {
    // Data
    submissions: data?.value || [],
    pagination: data?.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    refetch,
    handleViewSubmission,
    handleBack,
    
    // Pagination
    page,
    setPage,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage,
    canGoToPreviousPage,
  }
}
