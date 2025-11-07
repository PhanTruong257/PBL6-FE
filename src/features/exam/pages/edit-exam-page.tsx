import { useNavigate, useParams } from '@tanstack/react-router'
import { CreateExamForm } from '../components'
import { useEditExam } from '../hooks/use-exam'
import { Loader2 } from 'lucide-react'

export function EditExamPage() {
  const params = useParams({ strict: false }) as { id?: string }
  const examId = parseInt(params.id || '0', 10)
  const navigate = useNavigate()
  // Use the custom hook for exam editing
  const { exam, isLoading, error, isSubmitting, handleSubmit } = useEditExam(examId)

  const onSubmit = async (data: any) => {
    const success = await handleSubmit(data)
    if(success) {
      navigate({ to: '/exam' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Đang tải thông tin bài kiểm tra...</p>
        </div>
      </div>
    )
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-xl border border-destructive bg-destructive/10 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-destructive">Không tìm thấy bài kiểm tra</h2>
          <p className="text-muted-foreground">
            Bài kiểm tra không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CreateExamForm 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting}
        initialData={exam}
        mode="edit"
      />
    </div>
  )
}
