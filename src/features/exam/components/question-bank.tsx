import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { ExamService } from '../api'
import { QuestionCard } from './question-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuestionType, QuestionDifficulty } from '@/types/exam'
import { Search, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuestions } from '../hooks'

interface QuestionBankProps {
  selectedQuestionIds: number[]
}

export function QuestionBank({ selectedQuestionIds }: QuestionBankProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | 'all'>('all')

  const { setNodeRef, isOver } = useDroppable({
    id: 'question-bank',
  })


  const { data, isLoading } = useQuestions({
    search: search || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    difficulty: difficultyFilter !== 'all' ? difficultyFilter : undefined,
    limit: 50,
  })


  const availableQuestions = data?.questions.filter(
    (q) => !selectedQuestionIds.includes(q.question_id),
  )

  return (
    <div
      className={`flex h-full flex-col rounded-xl border bg-gradient-to-br from-background to-muted/20 shadow-sm transition-all duration-300 ${
        isOver ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : ''
      }`}
    >
      <div className="p-4 border-b bg-muted/30 rounded-t-xl">
        <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Ngân hàng câu hỏi
        </h3>

        {/* Search */}
        <div className="mb-3 space-y-2">
          <Label htmlFor="search" className="sr-only">
            Tìm kiếm
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Tìm kiếm câu hỏi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="type-filter" className="text-xs font-medium">
              Loại câu hỏi
            </Label>
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger id="type-filter" className="h-9 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value={QuestionType.MCQ}>Trắc nghiệm</SelectItem>
                <SelectItem value={QuestionType.ESSAY}>Tự luận</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="difficulty-filter" className="text-xs font-medium">
              Độ khó
            </Label>
            <Select
              value={difficultyFilter}
              onValueChange={(value: any) => setDifficultyFilter(value)}
            >
              <SelectTrigger id="difficulty-filter" className="h-9 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                <SelectItem value={QuestionDifficulty.EASY}>Dễ</SelectItem>
                <SelectItem value={QuestionDifficulty.MEDIUM}>Trung bình</SelectItem>
                <SelectItem value={QuestionDifficulty.HARD}>Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            {availableQuestions?.length || 0} câu hỏi có sẵn
          </p>
        </div>
      </div>

      {/* Questions List */}
      <ScrollArea className="flex-1 p-4" style={{ maxHeight: '800px' }}>
        <div ref={setNodeRef} className="space-y-2 pr-4">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">Đang tải câu hỏi...</p>
              </div>
            </div>
          ) : availableQuestions && availableQuestions.length > 0 ? (
            availableQuestions.map((question) => (
              <DraggableQuestion key={question.question_id} question={question} />
            ))
          ) : (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                  <span className="text-2xl">🔍</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Không tìm thấy câu hỏi</p>
                <p className="text-xs text-muted-foreground">Thử thay đổi bộ lọc</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function DraggableQuestion({ question }: { question: any }) {

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: question.question_id,
    data: { question },
  })

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <QuestionCard question={question} isDragging={isDragging} />
    </div>
  )
}
