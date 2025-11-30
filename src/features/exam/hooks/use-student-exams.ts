import { useState, useEffect } from 'react'
import { ExamService } from '../api/exam-service'
import { ExamStatus, type StudentExam, type GetStudentExamsQuery } from '@/types/exam'

export function useStudentExams() {
  const [exams, setExams] = useState<StudentExam[]>([])
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  
  // Filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ExamStatus | 'all'>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchExams()
  }, [search, status, startDate, endDate, page])

  const fetchExams = async () => {
    setIsLoading(true)
    try {
      const query: GetStudentExamsQuery = {
        page,
        limit: 10,
      }

      if (search) query.search = search
      if (status !== 'all') query.status = status as ExamStatus
      if (startDate) query.start_time = new Date(startDate).toISOString()
      if (endDate) query.end_time = new Date(endDate).toISOString()

      const response = await ExamService.getStudentExams(query)
      setExams(response.data.data ?? [])
      setMeta(response.data.pagination)
    } catch (error) {
      console.error('Error fetching student exams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    exams,
    meta,
    isLoading,
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
    refetch: fetchExams,
  }
}
