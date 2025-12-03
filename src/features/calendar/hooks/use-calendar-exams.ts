import { useState, useEffect, useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { ExamService } from '@/features/exam/api/exam-service'
import type { ScheduleEvent } from '../types'
import type { Exam, StudentExam } from '@/types/exam'

interface UseCalendarExamsResult {
  events: ScheduleEvent[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

// Transform exam data to ScheduleEvent format
function transformExamToEvent(
  exam: Exam,
  isTeacherExam: boolean,
): ScheduleEvent {
  console.log('Transforming exam:', {
    exam_id: exam.exam_id,
    title: exam.title,
    start_time: exam.start_time,
    end_time: exam.end_time,
  })

  return {
    id: exam.exam_id.toString(),
    title: exam.title,
    start: exam.start_time,
    end: exam.end_time,
    location: '',
    className: exam.description || '',
    teacher: isTeacherExam ? 'Bạn tạo' : 'Được giao',
    type: 'exam',
    examId: exam.exam_id,
    isTeacherExam,
  }
}

export function useCalendarExams(): UseCalendarExamsResult {
  const currentUser = useRecoilValue(currentUserState)
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExams = useCallback(async () => {
    if (!currentUser) {
      setEvents([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const isTeacher =
        currentUser.role === 'teacher' || currentUser.role === 'admin'

      if (isTeacher) {
        // Teacher: fetch exams they created
        const response = await ExamService.getExams({ limit: 100 })
        const examEvents = response.data.map((exam) =>
          transformExamToEvent(exam, true),
        )
        setEvents(examEvents)
      } else {
        // Student: fetch exams assigned to them
        // API returns nested structure: { data: { data: StudentExam[], pagination: {...} } }
        const response = await ExamService.getStudentExams({ limit: 100 })
        console.log('Student exams raw response:', response)
        // Handle both nested and flat response structure
        const examsData = (response as any).data?.data ?? response.data ?? []
        console.log('Student exams data:', examsData)
        const examEvents = examsData.map((exam: StudentExam) =>
          transformExamToEvent(exam, false),
        )
        console.log('Student exam events:', examEvents)
        setEvents(examEvents)
      }
    } catch (err) {
      console.error('Error fetching exams for calendar:', err)
      setError('Không thể tải dữ liệu bài kiểm tra')
    } finally {
      setIsLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  return {
    events,
    isLoading,
    error,
    refetch: fetchExams,
  }
}
