import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { QuestionCard } from './question-card'
import type { SelectedQuestion } from './create-exam-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface SelectedQuestionsProps {
  questions: SelectedQuestion[]
  onRemove: (questionId: number) => void
  onUpdatePoints: (questionId: number, points: number) => void
}

export function SelectedQuestions({ questions, onRemove, onUpdatePoints }: SelectedQuestionsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [totalPointsInput, setTotalPointsInput] = useState('')
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'selected-questions',
  })

  const handleAutoFillPoints = () => {
    const total = parseFloat(totalPointsInput)
    
    if (!total || total <= 0) {
      toast.error('Vui lòng nhập tổng điểm hợp lệ (lớn hơn 0)')
      return
    }

    if (questions.length === 0) {
      toast.error('Chưa có câu hỏi nào được chọn')
      return
    }

    // Calculate points per question
    const pointsPerQuestion = Number((total / questions.length).toFixed(2))
    const remainder = Number((total - pointsPerQuestion * questions.length).toFixed(2))

    // Distribute points evenly
    questions.forEach((question, index) => {
      let points = pointsPerQuestion
      // Add remainder to the last question to ensure total is exact
      if (index === questions.length - 1 && remainder !== 0) {
        points = Number((pointsPerQuestion + remainder).toFixed(2))
      }
      onUpdatePoints(question.question_id, points)
    })

    toast.success(`Đã phân chia ${total} điểm đều cho ${questions.length} câu hỏi`)
    setIsDialogOpen(false)
    setTotalPointsInput('')
  }

  if (questions.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={`flex h-full min-h-[500px] flex-col rounded-xl border-2 border-dashed bg-gradient-to-br from-muted/30 to-muted/10 p-6 transition-all duration-300 ${
          isOver ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/20'
        }`}
      >
        <h3 className="mb-4 text-lg font-semibold">Câu hỏi trong bài kiểm tra</h3>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <p className="text-5xl">📦</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">Kéo câu hỏi từ bên phải vào đây</p>
              <p className="text-sm text-muted-foreground">Hoặc nhấp "Thêm" trên câu hỏi bạn muốn chọn</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const totalPoints = questions.reduce((sum, q) => sum + Number(q.points), 0)

  return (
    <div className="flex h-full flex-col rounded-xl border bg-gradient-to-br from-background to-muted/20 shadow-sm">
      <div className="p-4 border-b bg-muted/30 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Câu hỏi đã chọn</h3>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <span className="font-semibold">{questions.length}</span>
              <span className="text-xs">câu</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
              <span className="font-bold">{totalPoints}</span>
              <span className="text-xs">điểm</span>
            </div>
          </div>
        </div>
        
        {/* Auto Fill Points Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-200 dark:border-blue-800"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Tự động phân chia điểm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Tự động phân chia điểm
              </DialogTitle>
              <DialogDescription className="pt-2">
                Nhập tổng số điểm bạn muốn phân chia đều cho <span className="font-semibold text-primary">{questions.length} câu hỏi</span> đã chọn.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="total-points" className="text-sm font-medium">
                  Tổng số điểm
                </Label>
                <Input
                  id="total-points"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Ví dụ: 10"
                  value={totalPointsInput}
                  onChange={(e) => setTotalPointsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAutoFillPoints()
                    }
                  }}
                  className="h-11 text-lg"
                  autoFocus
                />
                {totalPointsInput && parseFloat(totalPointsInput) > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Mỗi câu hỏi sẽ nhận được:{' '}
                    <span className="font-semibold text-foreground">
                      {(parseFloat(totalPointsInput) / questions.length).toFixed(2)} điểm
                    </span>
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setTotalPointsInput('')
                }}
              >
                Hủy
              </Button>
              <Button 
                type="button" 
                onClick={handleAutoFillPoints}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Áp dụng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1 p-4" style={{ maxHeight: '800px', overflowY: 'auto' }}>
        <div ref={setNodeRef} className="space-y-3 pr-4">
          {questions.map((question, index) => (
            <SortableQuestion
              key={question.question_id}
              question={question}
              index={index}
              onRemove={onRemove}
              onUpdatePoints={onUpdatePoints}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

interface SortableQuestionProps {
  question: SelectedQuestion
  index: number
  onRemove: (questionId: number) => void
  onUpdatePoints: (questionId: number, points: number) => void
}

function SortableQuestion({ question, index, onRemove, onUpdatePoints }: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.question_id,
    data: { question },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div className="flex gap-3 p-3 rounded-lg bg-card border hover:border-primary/50 transition-all duration-200 hover:shadow-md">
        {/* Drag Handle */}
        <button
          className="flex cursor-grab items-start pt-3 text-muted-foreground hover:text-primary active:cursor-grabbing transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Question Card */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {index + 1}
            </span>
          </div>
          <QuestionCard question={question} />

          {/* Points Input */}
          <div className="mt-3 flex items-center gap-3 p-2 rounded-md bg-muted/50">
            <Label htmlFor={`points-${question.question_id}`} className="text-sm font-medium">
              Điểm số:
            </Label>
            <Input
              id={`points-${question.question_id}`}
              type="number"
              min="0"
              step="0.5"
              value={question.points}
              onChange={(e) => onUpdatePoints(question.question_id, parseFloat(e.target.value) || 0)}
              className="h-9 w-24 font-semibold"
            />
          </div>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => onRemove(question.question_id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
