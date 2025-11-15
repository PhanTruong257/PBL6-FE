import { Clock, Calendar, CheckCircle2, PlayCircle, FileText, Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { StudentExam } from '@/types/exam'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface StudentExamListItemProps {
  exam: StudentExam
  onStartExam: (examId: number) => void
  onContinueExam: (examId: number, submissionId: number) => void
}

export function StudentExamListItem({ exam, onStartExam, onContinueExam }: StudentExamListItemProps) {
  const currentSubmission = exam.submissions[0] // Get current user's submission
  
  const getStatusBadge = () => {
    if (currentSubmission) {
      switch (currentSubmission.status) {
        case 'in_progress':
          return <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400">Đang làm</Badge>
        case 'submitted':
          return <Badge variant="outline" className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400">Đã nộp</Badge>
        case 'graded':
          return <Badge variant="outline" className="border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400">Đã chấm điểm</Badge>
      }
    }
    return <Badge variant="secondary">Chưa làm</Badge>
  }

  const getActionButton = () => {
    if (!currentSubmission) {
      // Chưa làm bài
      return (
        <Button 
          onClick={() => onStartExam(exam.exam_id)}
          className="min-w-[160px]"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Làm bài kiểm tra
        </Button>
      )
    }

    if (currentSubmission.status === 'in_progress') {
      // Đang làm bài
      return (
        <Button 
          onClick={() => onContinueExam(exam.exam_id, currentSubmission.submission_id)}
          variant="secondary"
          className="min-w-[160px]"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Tiếp tục làm bài
        </Button>
      )
    }

    if (currentSubmission.status === 'submitted' || currentSubmission.status === 'graded') {
      // Đã nộp bài
      return (
        <Button 
          variant="outline"
          disabled
          className="min-w-[160px]"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Đã nộp bài
        </Button>
      )
    }

    return null
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  return (
    <div className="border rounded-lg hover:shadow-md transition-shadow p-4 bg-card">
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold truncate">{exam.title}</h3>
                  {exam.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{exam.description}</p>
                  )}
                </div>
                {getStatusBadge()}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 ml-13">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-muted-foreground text-xs">Bắt đầu</div>
                <div className="font-medium truncate">{formatDateTime(exam.start_time)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-muted-foreground text-xs">Kết thúc</div>
                <div className="font-medium truncate">{formatDateTime(exam.end_time)}</div>
              </div>
            </div>

            {exam.duration && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <div className="text-muted-foreground text-xs">Thời gian</div>
                  <div className="font-medium">{formatDuration(exam.duration)}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="text-muted-foreground text-xs">Số câu hỏi</div>
                <div className="font-medium">{exam.question_exams?.length || 0} câu</div>
              </div>
            </div>

            {exam.total_points !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <div className="text-muted-foreground text-xs">Tổng điểm</div>
                  <div className="font-medium">{exam.total_points} điểm</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="text-muted-foreground text-xs">Lượt làm</div>
                <div className="font-medium">{exam._count.submissions} lượt</div>
              </div>
            </div>
          </div>


          {currentSubmission && currentSubmission.status === 'graded' && currentSubmission.score !== null && (
            <div className="mt-3 ml-13 flex items-center gap-2 p-2 bg-primary/10 border border-primary/30 rounded text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-foreground">
                <span className="font-medium">Điểm số: </span>
                <span className="text-lg font-bold">{currentSubmission.score}</span>
                {exam.total_points && <span> / {exam.total_points}</span>}
              </span>
            </div>
          )}
        </div>

        {/* Right side - Action button */}
        <div className="flex-shrink-0">
          {getActionButton()}
        </div>
      </div>
    </div>
  )
}
