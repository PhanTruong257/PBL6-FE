import { useNavigate } from '@tanstack/react-router'
import { ExamListHeader } from '../components/exam-list-header'
import { ExamListTable } from '../components/exam-list-table'
import { Pagination } from '../components/pagination'
import { useExamList } from '../hooks/use-exam-list'

export function ExamListPage() {
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
  } = useExamList()

  const totalPages = Math.ceil(meta.total / meta.limit)
  console.log('ExamListPage render', { exams, meta })

  const handleCreateClick = () => {
    navigate({ to: '/exam/create' })
  }

  const handleClearFilters = () => {
    setSearch('')
    setStatus('all')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  const handleEditClick = (examId: number) => {
    navigate({ to: '/exam/edit/$id', params: { id: String(examId) } })
  }

  const handleViewSubmissionsClick = (examId: number) => {
    navigate({
      to: '/exam/$examId/submissions/',
      params: { examId: String(examId) },
    } as any)
  }

  return (
    <div className="container mx-auto">
      <ExamListHeader
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onCreateClick={handleCreateClick}
        onClearFilters={handleClearFilters}
      />

      <ExamListTable
        exams={exams}
        isLoading={isLoading}
        onEditClick={handleEditClick}
        onViewSubmissionsClick={handleViewSubmissionsClick}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
