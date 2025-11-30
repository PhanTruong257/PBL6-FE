import { useParams } from '@tanstack/react-router'
import { ChevronLeft, CheckCircle, XCircle, Edit2, Save, X, MessageSquare } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSubmissionDetail } from '../hooks'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState } from 'react'

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

export function SubmissionDetailPage() {
  const { submissionId, examId } = useParams({ strict: false })

  const {
    submission,
    isLoading,
    isSubmitting,
    hasEdits,
    canSubmit,
    editingAnswerId,
    editedAnswers,
    handleBack,
    handleEditAnswer,
    handleUpdatePoints,
    handleUpdateComment,
    handleSaveAnswer,
    handleCancelEdit,
    handleSubmitGrades,
    getAnswerValue,
    isAnswerEdited,
  } = useSubmissionDetail(submissionId, examId)

  // Local state for comment dialog
  const [commentDialogOpen, setCommentDialogOpen] = useState(false)
  const [currentCommentAnswerId, setCurrentCommentAnswerId] = useState<number | null>(null)
  const [tempComment, setTempComment] = useState('')

  const handleOpenCommentDialog = (answerId: number, currentComment?: string) => {
    setCurrentCommentAnswerId(answerId)
    setTempComment(getAnswerValue(answerId, 'comment', currentComment || ''))
    setCommentDialogOpen(true)
  }

  const handleSaveComment = () => {
    if (currentCommentAnswerId) {
      handleUpdateComment(currentCommentAnswerId, tempComment)
    }
    setCommentDialogOpen(false)
    setCurrentCommentAnswerId(null)
    setTempComment('')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              Không tìm thấy bài nộp
            </p>
          </CardContent>
        </Card>
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
              Chi tiết bài nộp #{submission.submission_id}
            </h1>
            <p className="text-gray-500 mt-1">
              Xem câu trả lời và kết quả của học sinh
            </p>
          </div>
        </div>
        
        {/* Submit button - show always when status is not 'graded' */}
        {submission.status !== 'graded' && (
          <Button
            onClick={handleSubmitGrades}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {hasEdits
                  ? `Xác nhận kết quả (${Object.keys(editedAnswers).length} thay đổi)`
                  : 'Xác nhận kết quả'}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Submission Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin bài nộp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Học sinh</p>
              <p className="font-medium">Học sinh #{submission.student_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bài kiểm tra</p>
              <p className="font-medium">{submission.exam.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <Badge
                className={
                  statusColors[submission.status] ||
                  'bg-gray-100 text-gray-800'
                }
              >
                {statusLabels[submission.status] || submission.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Điểm</p>
              <p className="font-semibold text-lg text-indigo-600">
                {submission.score !== null && submission.score !== undefined
                  ? submission.score
                  : 'Chưa chấm'}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Thời gian nộp</p>
              <p className="font-medium">
                {submission.submitted_at
                  ? format(
                      new Date(submission.submitted_at),
                      'dd/MM/yyyy HH:mm:ss',
                      { locale: vi }
                    )
                  : '-'}
              </p>
            </div>
            {submission.graded_at && (
              <div>
                <p className="text-sm text-gray-500">Thời gian chấm</p>
                <p className="font-medium">
                  {format(
                    new Date(submission.graded_at),
                    'dd/MM/yyyy HH:mm:ss',
                    { locale: vi }
                  )}
                </p>
              </div>
            )}
          </div>

          {submission.teacher_feedback && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">Nhận xét của giáo viên</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{submission.teacher_feedback}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Answers */}
      <Card>
        <CardHeader>
          <CardTitle>Câu trả lời</CardTitle>
          <CardDescription>
            Tổng số: {submission.answers?.length || 0} câu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submission.answers || submission.answers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có câu trả lời nào</p>
            </div>
          ) : (
            <div className="space-y-6">
              {submission.answers.map((answer, index) => {
                console.log('answer object', answer)
                const isEssay = answer.question.type === 'essay'
                const isMultipleChoice = answer.question.type === 'multiple_choice'
                const isMultipleAnswer = answer.question.is_multiple_answer
                const options = answer.question.options as unknown as { answers: Array<{ id: string; text: string; is_correct: boolean }> } | null
                
                // Get current values (edited or original)
                const currentPoints = getAnswerValue(answer.answer_id, 'points_earned', answer.points_earned)
                const currentComment = getAnswerValue(answer.answer_id, 'comment', answer.comment)
                const isEdited = isAnswerEdited(answer.answer_id)
                const isCurrentlyEditing = editingAnswerId === answer.answer_id

                return (
                  <div
                    key={answer.answer_id}
                    className={`border rounded-lg p-4 space-y-3 ${isEdited ? 'border-indigo-400 bg-indigo-50/30' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-indigo-600">
                            Câu {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {isEssay ? 'Tự luận' : isMultipleAnswer ? 'Nhiều đáp án' : 'Một đáp án'}
                          </Badge>
                          {isEdited && (
                            <Badge className="text-xs bg-indigo-600">
                              Đã chỉnh sửa
                            </Badge>
                          )}
                          {!isEssay && !isMultipleAnswer && (
                            answer.is_correct ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600" />
                            )
                          )}
                        </div>
                        <p className="text-gray-700 mb-3 font-medium">
                          {answer.question.content}
                        </p>

                        {/* Question options (if MCQ) */}
                        {isMultipleChoice && options && (
                          <div className="bg-gray-50 p-3 rounded mb-3">
                            <p className="text-sm font-medium text-gray-600 mb-2">
                              Các lựa chọn:
                            </p>
                            <ul className="space-y-2">
                              {options.map((option) => {
                                const parsed = JSON.parse(answer.answer_content || '[]');
                                const questionAnswer = Array.isArray(parsed) ? parsed : [parsed];
                                const isStudentAnswer = questionAnswer.includes(option.id);
                                const isCorrectAnswer = option.text.startsWith('=')

                                return (
                                  <li
                                    key={option.id}
                                    className={`flex items-start gap-2 p-2 rounded ${
                                      isStudentAnswer && isCorrectAnswer
                                        ? 'bg-green-100 border border-green-300'
                                        : isStudentAnswer && !isCorrectAnswer
                                        ? 'bg-red-100 border border-red-300'
                                        : isCorrectAnswer
                                        ? 'bg-green-50 border border-green-200'
                                        : ''
                                    }`}
                                  >
                                    <span className="font-semibold text-gray-700 min-w-[24px]">
                                      {option.id})
                                    </span>
                                    <span className="text-gray-700 flex-1">
                                      {option.text.substring(1)}
                                    </span>
                                    {isStudentAnswer && (
                                      <Badge variant="secondary" className="text-xs">
                                        Đã chọn
                                      </Badge>
                                    )}
                                    {isCorrectAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )}

                        {/* Student answer for essay */}
                        {isEssay && (
                          <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="text-sm font-medium text-gray-600 mb-1">
                              Câu trả lời:
                            </p>
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {answer.answer_content || '(Chưa trả lời)'}
                            </p>
                          </div>
                        )}

                        {/* Comment section */}
                        {(currentComment || isEssay || isMultipleAnswer) && (
                          <div className="mt-3">
                            {currentComment ? (
                              <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                      Nhận xét:
                                    </p>
                                    <p className="text-gray-800 whitespace-pre-wrap">{currentComment}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleOpenCommentDialog(answer.answer_id, currentComment)}
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenCommentDialog(answer.answer_id, currentComment)}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Thêm nhận xét
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      {submission.status != 'graded' && (<div className="ml-4 text-right min-w-[100px]">
                        <p className="text-sm text-gray-500 mb-1">Điểm</p>
                        {(isEssay || isMultipleAnswer) && isCurrentlyEditing ? (
                          <div className="flex flex-col gap-2">
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              value={currentPoints}
                              onChange={(e) => handleUpdatePoints(answer.answer_id, e.target.value)}
                              className="w-20 text-center"
                              autoFocus
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={handleSaveAnswer}
                              >
                                <Save className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleCancelEdit(answer.answer_id)}
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <p className="text-xl font-bold text-indigo-600">
                              {currentPoints}
                            </p>
                            {(isEssay || isMultipleAnswer) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEditAnswer(answer.answer_id, String(currentPoints), currentComment)}
                              >
                                <Edit2 className="w-4 h-4 text-gray-500" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>) }
                     {submission.status == 'graded' && ( <span className="text-blue-700 font-bold">{currentPoints}</span>)} 
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm/Sửa nhận xét</DialogTitle>
            <DialogDescription>
              Nhập nhận xét cho câu trả lời này
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập nhận xét của bạn..."
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCommentDialogOpen(false)
                setTempComment('')
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveComment}>
              Lưu nhận xét
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
