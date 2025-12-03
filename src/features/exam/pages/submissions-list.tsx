import { useParams } from '@tanstack/react-router'
import { ChevronLeft, Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSubmissionsList } from '../hooks'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

const statusLabels: Record<string, string> = {
  in_progress: 'Đang làm',
  submitted: 'Đã nộp',
  cancelled: 'Đã hủy',
  graded: 'Đã chấm',
}

const statusColors: Record<string, string> = {
  in_progress: 'bg-blue-100 text-blue-800',
  submitted: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  graded: 'bg-green-100 text-green-800',
}

export function SubmissionsListPage() {
  const { examId } = useParams({ strict: false })
  
  const {
    submissions,
    pagination,
    isLoading,
    handleViewSubmission,
    handleBack,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage,
    canGoToPreviousPage,
  } = useSubmissionsList(examId)

  console.log("submissions", submissions);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Danh sách bài nộp
            </h1>
            <p className="text-gray-500 mt-1">
              Xem và quản lý các bài nộp của học sinh
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bài nộp</CardTitle>
          <CardDescription>
            Tổng số: {pagination.total || 0} bài nộp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submissions || submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chưa có bài nộp nào</p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Tên học sinh</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                      <TableHead className="text-center">Điểm</TableHead>
                      <TableHead className="text-center">
                        Số câu đã trả lời
                      </TableHead>
                      <TableHead className="text-center">
                        Thời gian nộp
                      </TableHead>
                      <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission : any) => (
                      <TableRow
                        key={submission.submission_id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="font-medium">
                          {submission.student_email}
                        </TableCell>
                        <TableCell>
                         {submission.student_name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              statusColors[submission.status] ||
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {statusLabels[submission.status] ||
                              submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {submission.score !== null &&
                          submission.score !== undefined ? (
                            <span className="font-semibold text-indigo-600">
                              {submission.score}
                            </span>
                          ) : (
                            <span className="text-gray-400">Chưa chấm</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {submission._count?.answers  || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          {submission.submitted_at
                            ? format(
                                new Date(submission.submitted_at),
                                'dd/MM/yyyy HH:mm',
                                { locale: vi }
                              )
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-indigo-600 hover:bg-indigo-50"
                              onClick={() =>
                                handleViewSubmission(submission.submission_id)
                              }
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Trang {pagination.page} / {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={!canGoToPreviousPage}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={!canGoToNextPage}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
