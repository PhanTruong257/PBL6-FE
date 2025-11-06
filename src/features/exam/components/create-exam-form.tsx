import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ExamBasicInfo } from './exam-basic-info'
import { QuestionBank } from './question-bank'
import { SelectedQuestions } from './selected-questions'
import { QuestionCard } from './question-card'
import type { Question, ExamWithQuestions, ExamStatus } from '@/types/exam'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useCreateExam } from '../hooks/use-exam'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'

export interface SelectedQuestion extends Question {
  points: number
  order: number
}

interface CreateExamFormProps {
  onSubmit?: (data: {
    basicInfo: {
      class_id: number
      title: string
      description?: string
      duration?: number
      start_time: string
      end_time: string
      total_points?: number
      status?: ExamStatus
    }
    questions: SelectedQuestion[]
  }) => Promise<void>
  isSubmitting?: boolean
  initialData?: ExamWithQuestions // For edit mode
  mode?: 'create' | 'edit' // Determines the mode
}


function formatDateTimeLocal(datetime: string): string {
  if (!datetime) return '';
  const date = new Date(datetime);
  // Convert to local time and remove seconds/milliseconds
  return date.toISOString().slice(0, 16);
}

export function CreateExamForm({ 
  onSubmit: customOnSubmit, 
  isSubmitting: customIsSubmitting = false,
  initialData,
  mode = 'create',
}: CreateExamFormProps) {
  const navigate = useNavigate()
  const createExamMutation = useCreateExam()
  const currentUser = useRecoilValue(currentUserState)
  
  const [basicInfo, setBasicInfo] = useState({
    class_id: initialData?.class_id || 1,
    title: initialData?.title || '',
    exam_code: '',
    description: initialData?.description || '',
    duration: initialData?.duration || 45,
    start_time: initialData?.start_time ? formatDateTimeLocal(initialData.start_time) : '',
    end_time: initialData?.end_time ? formatDateTimeLocal(initialData.end_time) : '',
    status: initialData?.status || 'draft',
    total_points: initialData?.total_points || 0,
  })

  const [selectedQuestions, setSelectedQuestions] = useState<SelectedQuestion[]>(
    initialData?.questions ? initialData.questions.map((q, idx) => ({
      ...q,
      order: q.order ?? idx,
    } as SelectedQuestion)) : []
  )
  const [activeQuestion, setActiveQuestion] = useState<Question | SelectedQuestion | null>(null)

  // Update state when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setBasicInfo({
        class_id: initialData.class_id,
        title: initialData.title,
        exam_code: '',
        description: initialData.description || '',
        duration: initialData.duration || 45,
        start_time: formatDateTimeLocal(initialData.start_time),
        end_time: formatDateTimeLocal(initialData.end_time),
        status: initialData.status || 'draft',
        total_points: initialData.total_points || 0,
      })
      
      if (initialData.questions) {
        const formattedQuestions = initialData.questions.map((q, idx) => ({
          ...q,
          order: q.order ?? idx,
        } as SelectedQuestion))
        setSelectedQuestions(formattedQuestions)
      }
    }
  }, [initialData])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const question = active.data.current?.question as Question | SelectedQuestion
    setActiveQuestion(question)
  }

  const  handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    console.log({ active, over })

    if (!over) {
      setActiveQuestion(null)
      return
    }

    const activeQuestion = active.data.current?.question as Question | SelectedQuestion
    const isFromBank = active.data.current?.sortable === undefined
    const isOverBank = over.id === 'question-bank'
    const isOverSelected = over.id === 'selected-questions' || over.data.current?.sortable

    // Remove question if dragged from selected back to bank
    if (!isFromBank && isOverBank) {
      handleRemoveQuestion(activeQuestion.question_id)
      setActiveQuestion(null)
      return
    }

    // From bank to selected list
    if (isFromBank && !isOverBank) {
      const exists = selectedQuestions.some((q) => q.question_id === activeQuestion.question_id)
      if (!exists) {
        const newQuestion: SelectedQuestion = {
          ...activeQuestion,
          points: 1,
          order: selectedQuestions.length,
        }

        // Insert at specific position if dropped over a question
        if (over.data.current?.sortable) {
          const overIndex = selectedQuestions.findIndex((q) => q.question_id === over.id)
          if (overIndex !== -1) {
            const newQuestions = [...selectedQuestions]
            newQuestions.splice(overIndex, 0, newQuestion)
            setSelectedQuestions(newQuestions.map((q, idx) => ({ ...q, order: idx })))
          } else {
            setSelectedQuestions([...selectedQuestions, newQuestion])
          }
        } else {
          setSelectedQuestions([...selectedQuestions, newQuestion])
        }
      }
    }

    // Reordering within selected list
    if (!isFromBank && isOverSelected && active.id !== over.id) {
      const oldIndex = selectedQuestions.findIndex((q) => q.question_id === active.id)
      const newIndex = selectedQuestions.findIndex((q) => q.question_id === over.id)
      console.log({ oldIndex, newIndex })

      if (oldIndex !== -1 && newIndex !== -1) {
        const newQuestions = [...selectedQuestions]
        const [movedQuestion] = newQuestions.splice(oldIndex, 1)
        newQuestions.splice(newIndex, 0, movedQuestion)
        setSelectedQuestions(newQuestions.map((q, idx) => ({ ...q, order: idx })))
      }
    }

    setActiveQuestion(null)
  }

  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.filter((q) => q.question_id !== questionId).map((q, idx) => ({ ...q, order: idx })),
    )
  }

  const handleUpdatePoints = (questionId: number, points: number) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.question_id === questionId ? { ...q, points } : q)),
    )
  }

  const handleSubmit = async () => {
    // Calculate total points
    const total_points = selectedQuestions.reduce((sum, q) => sum + q.points, 0)

    const examData = {
      basicInfo: {
        class_id: basicInfo.class_id,
        title: basicInfo.title,
        description: basicInfo.description,
        duration: basicInfo.duration,
        start_time: basicInfo.start_time,
        end_time: basicInfo.end_time,
        status: basicInfo.status as ExamStatus,
        total_points,
      },
      questions: selectedQuestions,
    }

    try {
      // Use custom onSubmit if provided, otherwise use the mutation
      if (customOnSubmit) {
        console.log('Submitting via custom onSubmit', examData)
        await customOnSubmit(examData)
      } else {
        console.log('Submitting via createExamMutation', examData)
        // Validate user is logged in
        if (!currentUser?.user_id) {
          toast.error('Bạn cần đăng nhập để tạo bài kiểm tra')
          return
        }

        // Transform to API format
        const createExamRequest = {
          class_id: basicInfo.class_id,
          title: basicInfo.title,
          description: basicInfo.description,
          start_time: basicInfo.start_time,
          end_time: basicInfo.end_time,
          total_time: basicInfo.duration || 45,
          total_points,
          allow_review: true,
          created_by: currentUser.user_id,
          questions: selectedQuestions.map(q => ({
            question_id: q.question_id,
            points: q.points,
            order: q.order,
          })),
        }

        await createExamMutation.mutateAsync(createExamRequest)
        
        toast.success('Tạo bài kiểm tra thành công!')
        
        // Navigate back or to a specific page
        navigate({ to: '/dashboard' })
      }
    } catch (error: any) {
      console.error('Error creating exam:', error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo bài kiểm tra')
    }
  }

  const isValid = basicInfo.title && basicInfo.start_time && basicInfo.end_time && selectedQuestions.length > 0
  const isSubmitting = customIsSubmitting || createExamMutation.isPending
  const buttonText = mode === 'edit' ? 'Cập nhật' : 'Tạo mới'

  return (
    <div className="relative min-h-screen pb-6">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">
                {mode === 'edit' ? 'Chỉnh sửa bài kiểm tra' : 'Tạo bài kiểm tra mới'}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                disabled={isSubmitting}
                onClick={() => navigate({ to: '/exam' })}
                className="min-w-[100px]"
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!isValid || isSubmitting}
                className="min-w-[120px] bg-primary hover:bg-primary/90"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-6 space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gradient-to-br from-card to-card/50 rounded-xl border shadow-sm">
          <ExamBasicInfo basicInfo={basicInfo} onChange={setBasicInfo} />
        </div>

        {/* Drag and Drop Section */}
        <div className="bg-gradient-to-br from-card to-card/50 rounded-xl border shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Câu hỏi trong bài kiểm tra</h2>
            <p className="text-sm text-muted-foreground">
              Kéo thả câu hỏi từ ngân hàng để thêm vào bài kiểm tra
            </p>
          </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Selected Questions (Left) */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <SortableContext
                items={selectedQuestions.map((q) => q.question_id)}
                strategy={verticalListSortingStrategy}
              >
                <SelectedQuestions
                  questions={selectedQuestions}
                  onRemove={handleRemoveQuestion}
                  onUpdatePoints={handleUpdatePoints}
                />
              </SortableContext>
            </div>

            {/* Question Bank (Right) */}
            <div className="order-1 lg:order-2 lg:col-span-1">
              <QuestionBank selectedQuestionIds={selectedQuestions.map((q) => q.question_id)} />
            </div>
          </div>

          <DragOverlay>
            {activeQuestion ? <QuestionCard question={activeQuestion} isDragging /> : null}
          </DragOverlay>
        </DndContext>
        </div>
      </div>
    </div>
  )
}
