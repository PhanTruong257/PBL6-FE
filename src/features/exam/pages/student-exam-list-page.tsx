import { useNavigate } from '@tanstack/react-router'
import { StudentExamListHeader } from '../components/student-exam-list-header'
import { StudentExamList } from '../components/student-exam-list'
import { Pagination } from '../components/pagination'
import { useStudentExams } from '../hooks/use-student-exams'

export function StudentExamListPage() {
  const navigate = useNavigate()
  const {
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
  } = useStudentExams()

  const handleClearFilters = () => {
    setSearch('')
    setStatus('all')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const handleStartExam = (examId: number) => {
    navigate({ to: '/exam/$examId/take', params: { examId: String(examId) } })
  }

  const handleContinueExam = (examId: number, _submissionId: number) => {
    // Navigate to the same route, the exam taking page will handle continuation
    navigate({ to: '/exam/$examId/take', params: { examId: String(examId) } })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <StudentExamListHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onClearFilters={handleClearFilters}
      />

      <StudentExamList
        exams={exams}
        isLoading={isLoading}
        onStartExam={handleStartExam}
        onContinueExam={handleContinueExam}
      />

      {meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
