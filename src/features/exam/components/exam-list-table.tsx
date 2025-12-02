import { Clock, FileText, Copy, Edit, Trash2, Users } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { ExamWithQuestions } from '@/types/exam'

interface ExamListTableProps {
  exams: ExamWithQuestions[]
  isLoading: boolean
  onEditClick: (examId: number) => void
  onCopyClick?: (examId: number) => void
  onDeleteClick?: (examId: number) => void
  onViewSubmissionsClick?: (examId: number) => void
}

const statusLabels: Record<string, string> = {
  draft: 'Bản nháp',
  published: 'Công khai',
  in_progress: 'Đang diễn ra',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-green-800',
  published: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

function formatDateTimeLocal(datetime: string): string {
  if (!datetime) return '';
  const date = new Date(datetime);
  // Convert to local time and remove seconds/milliseconds
  return date.toISOString().slice(0, 16).replace('T', ' ');
}

export function ExamListTable({
  exams,
  isLoading,
  onEditClick,
  onCopyClick,
  onDeleteClick,
  onViewSubmissionsClick,
}: ExamListTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!exams || exams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không có bài kiểm tra nào</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader className="bg-indigo-600">
          <TableRow>
            <TableHead className="text-white font-semibold">Tên bài kiểm tra</TableHead>
            <TableHead className="text-white font-semibold text-center">Thời gian</TableHead>
            <TableHead className="text-white font-semibold text-center">Số câu hỏi</TableHead>
            <TableHead className="text-white font-semibold text-center">Thời gian bắt đầu</TableHead>
            <TableHead className="text-white font-semibold text-center">Thời gian kết thúc</TableHead>
            <TableHead className="text-white font-semibold text-center">Trạng thái</TableHead>
            <TableHead className="text-white font-semibold text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exams.map((exam) => (
            <TableRow key={exam.exam_id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{exam.title}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{exam.duration || 0} phút</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="text-indigo-600 font-medium">
                    {exam.questions?.length || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  <div>
                    {formatDateTimeLocal(exam.start_time)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm">
                  <div>
                    {formatDateTimeLocal(exam.end_time)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[exam.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {statusLabels[exam.status] || exam.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-600 hover:bg-purple-50"
                    onClick={() => onViewSubmissionsClick?.(exam.exam_id)}
                    disabled={!onViewSubmissionsClick}
                    title="Xem bài nộp"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-600 hover:bg-blue-50"
                    onClick={() => onCopyClick?.(exam.exam_id)}
                    disabled={!onCopyClick}
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-green-600 hover:bg-green-50"
                    onClick={() => onEditClick(exam.exam_id)}
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteClick?.(exam.exam_id)}
                    disabled={!onDeleteClick}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
