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
import { AutoGenerateQuestions, type AutoGenerateConfig } from './auto-generate-questions'
import type { Question, ExamWithQuestions, ExamStatus } from '@/types/exam'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Wand2, Hand } from 'lucide-react'
import { useCreateExam, useGetRandomQuestions } from '../hooks/use-exam'
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
  const getRandomQuestionsMutation = useGetRandomQuestions()
  const currentUser = useRecoilValue(currentUserState)
  
  const [creationMode, setCreationMode] = useState<'manual' | 'auto'>('manual')
  const [isGenerating, setIsGenerating] = useState(false)
  
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
    
    // In auto mode, only handle reordering
    if (creationMode === 'auto') {
      if (active.id !== over.id) {
        const oldIndex = selectedQuestions.findIndex((q) => q.question_id === active.id)
        const newIndex = selectedQuestions.findIndex((q) => q.question_id === over.id)
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newQuestions = [...selectedQuestions]
          const [movedQuestion] = newQuestions.splice(oldIndex, 1)
          newQuestions.splice(newIndex, 0, movedQuestion)
          setSelectedQuestions(newQuestions.map((q, idx) => ({ ...q, order: idx })))
        }
      }
      setActiveQuestion(null)
      return
    }

    // Manual mode: handle drag from bank and reordering
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

  const handleAutoGenerate = async (config: AutoGenerateConfig) => {
    setIsGenerating(true)
    try {
      // Validate user is logged in
      if (!currentUser?.user_id) {
        toast.error('Bạn cần đăng nhập để tạo câu hỏi tự động')
        return
      }

      
      // Transform config to API request format (backend expects snake_case)
      const request = {
        criteria: config.criteria.map(c => ({
          category_id: c.categoryId,
          type: c.questionType || '',
          quantity: c.count,
        })),
        userId: currentUser.user_id,
      }


      // Call API to get random questions
      const response = await getRandomQuestionsMutation.mutateAsync(request)
      

      // Check if we got questions back
      if (!response.data || response.data.length === 0) {
        toast.warning('Không tìm thấy câu hỏi phù hợp với điều kiện')
        return
      }

      // Transform questions to SelectedQuestion format and add to selected list
      const newQuestions: SelectedQuestion[] = response.data.map((q: any, idx: number) => ({
        question_id: q.question_id,
        content: q.content,
        type: q.type,
        difficulty: q.difficulty,
        tags: q.category ? [q.category.name] : [],
        is_multiple_answer: q.is_multiple_answer || false,
        created_at: q.created_at,
        // Handle options for multiple_choice questions
        options: q.options, 
        points: 1, // Default points
        order: selectedQuestions.length + idx,
      }))


      // Add to existing selected questions
      setSelectedQuestions(newQuestions)

      toast.success(
        `Đã tạo thành công ${response.total} câu hỏi! (Yêu cầu: ${response.summary.requested})`
      )
      
    } catch (error: any) {
      console.error('Error generating questions:', error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo câu hỏi tự động')
    } finally {
      setIsGenerating(false)
    }
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
        await customOnSubmit(examData)
      } else {
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

        {/* Creation Mode Selector */}
        <div className="bg-gradient-to-br from-card to-card/50 rounded-xl border shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Chế độ tạo câu hỏi</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn cách thức thêm câu hỏi vào bài kiểm tra
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manual Mode */}
              <button
                type="button"
                onClick={() => setCreationMode('manual')}
                className={`relative flex flex-col items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                  creationMode === 'manual'
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    creationMode === 'manual' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Hand className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold">Thủ công</h3>
                    <p className="text-sm text-muted-foreground">Kéo thả câu hỏi từ ngân hàng</p>
                  </div>
                  {creationMode === 'manual' && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>

              {/* Auto Mode */}
              <button
                type="button"
                onClick={() => setCreationMode('auto')}
                className={`relative flex flex-col items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                  creationMode === 'auto'
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    creationMode === 'auto' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <Wand2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold">Tự động</h3>
                    <p className="text-sm text-muted-foreground">Sinh câu hỏi theo điều kiện</p>
                  </div>
                  {creationMode === 'auto' && (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Drag and Drop Section - Manual Mode */}
        <div className={`bg-gradient-to-br from-card to-card/50 rounded-xl border shadow-sm p-6 ${creationMode !== 'manual' ? 'hidden' : ''}`}>
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

        {/* Auto Generate Section */}
        <div className={creationMode !== 'auto' ? 'hidden' : ''}>
          {/* Auto Generate Form */}
          <div className="bg-gradient-to-br from-card to-card/50 rounded-xl border shadow-sm p-6 mb-6">
            <AutoGenerateQuestions onGenerate={handleAutoGenerate} isGenerating={isGenerating} />
          </div>

          {/* Selected Questions Preview in Auto Mode */}
          {selectedQuestions.length > 0 && (
            <div className="bg-gradient-to-br from-card to-card/50 rounded-xl border shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                  Câu hỏi đã tạo ({selectedQuestions.length})
                </h2>
                <p className="text-sm text-muted-foreground">
                  Kéo thả để sắp xếp lại thứ tự câu hỏi
                </p>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
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

                <DragOverlay>
                  {activeQuestion ? <QuestionCard question={activeQuestion} isDragging /> : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
