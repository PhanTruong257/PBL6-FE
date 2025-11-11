import { CreateExamForm } from '../components'
import type { CreateExamRequest } from '@/types/exam'
import { useCreateExam } from '../hooks'
import { toast } from '@/libs/toast'
import { useNavigate } from '@tanstack/react-router'

export function CreateExamPage() {
  const createExamMutation = useCreateExam()
  const navigate = useNavigate()

  const handleSubmit = async (data: {
    basicInfo: Omit<CreateExamRequest, 'questions'>
    questions: Array<{ question_id: number; points: number; order: number }>
  }) => {
    const createData: CreateExamRequest = {
      ...data.basicInfo,
      questions: data.questions.map((q) => ({
        question_id: q.question_id,
        points: Number(q.points),
        order: q.order,
      })),
    }

    await createExamMutation.mutateAsync(createData)

    toast.success('Tạo bài kiểm tra thành công!')
        
    navigate({ to: '/exam' })
    
  }

  return (
    <div className="min-h-screen bg-background">
      <CreateExamForm onSubmit={handleSubmit} isSubmitting={createExamMutation.isPending} />
    </div>
  )
}
