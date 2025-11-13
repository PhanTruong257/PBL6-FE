import { StudentExamListItem } from './student-exam-list-item'
import type { StudentExam } from '@/types/exam'

interface StudentExamListProps {
  exams: StudentExam[]
  isLoading: boolean
  onStartExam: (examId: number) => void
  onContinueExam: (examId: number, submissionId: number) => void
}

export function StudentExamList({ exams, isLoading, onStartExam, onContinueExam }: StudentExamListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (exams.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy bài kiểm tra nào
        </h3>
        <p className="text-gray-500">
          Bạn chưa có bài kiểm tra nào hoặc thử thay đổi bộ lọc để tìm kiếm.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {exams.map((exam) => (
        <StudentExamListItem
          key={exam.exam_id}
          exam={exam}
          onStartExam={onStartExam}
          onContinueExam={onContinueExam}
        />
      ))}
    </div>
  )
}
