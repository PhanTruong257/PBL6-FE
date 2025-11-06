import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ExamService } from '../api'
import type { GetExamsQuery, ExamStatus } from '@/types/exam'

/**
 * Hook to manage exam list with search and filters
 */
export function useExamList() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ExamStatus | 'all'>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10

  // Build query params
  const queryParams: GetExamsQuery = {
    page,
    limit,
  }

  if (search) {
    queryParams.search = search
  }

  if (status !== 'all') {
    queryParams.status = status as ExamStatus
  }

  if (startDate) {
    queryParams.start_time = startDate
  }

  if (endDate) {
    queryParams.end_time = endDate
  }

  // Fetch exams
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['exams', queryParams],
    queryFn: () => ExamService.getExams(queryParams),
  })

  return {
    exams: data?.data || [],
    meta: data?.meta || { total: 0, page: 1, limit: 10 },
    isLoading,
    error,
    refetch,
    // Filter states
    search,
    setSearch,
    status,
    setStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    page,
    setPage,
  }
}
