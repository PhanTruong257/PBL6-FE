import { cn } from '@/libs/utils'
import { Badge } from '@/components/ui/badge'
import type { Question, QuestionType, QuestionDifficulty } from '@/types/exam'
import { CheckCircle2, FileText, ListChecks } from 'lucide-react'

interface QuestionCardProps {
  question: Question | (Question & { points?: number })
  isDragging?: boolean
}

export function QuestionCard({ question, isDragging = false }: QuestionCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md',
        isDragging && 'rotate-2 cursor-grabbing opacity-90 shadow-lg',
      )}
    >
      {/* Question Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <QuestionTypeIcon type={question.type} />
          <span className="text-xs font-medium text-muted-foreground">
            #{question.question_id}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {question.difficulty && <DifficultyBadge difficulty={question.difficulty} />}
          <Badge variant="outline" className="text-xs">
            {getQuestionTypeLabel(question.type)}
          </Badge>

                {question.is_multiple_answer && (
        <Badge variant="secondary" className="text-xs">
          Nhiều đáp án
        </Badge>
      )}
        </div>
      </div>

      {/* Question Content */}
      <p className="mb-3 text-sm leading-relaxed">{question.content}</p>

      {/* Options for MCQ */}
      {question.type === 'multiple_choice' && 
       question.options && 
       question.options.length > 0 && (
        <div className="space-y-1.5 rounded-md bg-muted/50 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Các đáp án:</p>
          {question.options.map((option, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-medium">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 text-xs">{option}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {question.tags && question.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {question.tags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}


        </div>
      )}

    </div>
  )
}

function QuestionTypeIcon({ type }: { type: QuestionType }) {
  switch (type) {
    case 'multiple_choice':
      return <ListChecks className="h-4 w-4 text-blue-500" />
    case 'true/false':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case 'essay':
      return <FileText className="h-4 w-4 text-purple-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

function DifficultyBadge({ difficulty }: { difficulty: QuestionDifficulty }) {
  const colors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  }

  const labels = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        colors[difficulty],
      )}
    >
      {labels[difficulty]}
    </span>
  )
}

function getQuestionTypeLabel(type: QuestionType): string {
  switch (type) {
    case 'multiple_choice':
      return 'Trắc nghiệm'
    case 'true/false':
      return 'Đúng/Sai'
    case 'essay':
      return 'Tự luận'
    default:
      return type
  }
}
