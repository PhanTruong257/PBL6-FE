import { Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Question } from '@/types/question'
import { formatDate } from '@/libs/utils'
import { useQuestionsTranslation } from '../hooks'

interface QuestionDetailDialogProps {
  open: boolean
  onClose: () => void
  question: Question | null
}

export function QuestionDetailDialog({
  open,
  onClose,
  question,
}: QuestionDetailDialogProps) {
  const { t } = useQuestionsTranslation()

  if (!question) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('dialog.detailTitle')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('dialog.questionLabel')}</h3>
              <p className="text-base leading-relaxed">{question.content}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div>
                <span className="text-sm text-muted-foreground">{t('form.type')}: </span>
                <Badge variant="outline">{t(`types.${question.type === 'multiple_choice' ? 'multipleChoice' : 'essay'}`)}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">{t('form.difficulty')}: </span>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {t(`difficulty.${question.difficulty}`)}
                </Badge>
              </div>
              {question.category && (
                <div>
                  <span className="text-sm text-muted-foreground">{t('form.category')}: </span>
                  <Badge variant="secondary">{question.category.name}</Badge>
                </div>
              )}
              <div>
                <span className="text-sm text-muted-foreground">{t('visibility.public')}: </span>
                <Badge variant={question.is_public ? 'default' : 'secondary'}>
                  {question.is_public ? t('visibility.public') : t('visibility.private')}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Multiple Choice Options */}
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {t('dialog.answerOptions')}
                {question.is_multiple_answer && (
                  <span className="ml-2 text-xs">{t('dialog.multipleAnswersAllowed')}</span>
                )}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, index) => {
                  // Parse prefix to determine correctness
                  const isCorrect = option.text.startsWith('=')
                  const displayText = option.text.substring(1) // Remove prefix
                  
                  return (
                    <div
                      key={option.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <p className="flex-1">{displayText}</p>
                      {isCorrect && (
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <Separator />

          {/* Usage in Exams */}
          {question.question_exams && question.question_exams.length > 0 && (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t('dialog.usedInExams', { count: question.question_exams.length })}
                </h3>
                <div className="space-y-2">
                  {question.question_exams.map((qe) => (
                    <div
                      key={qe.exam_id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div>
                        <p className="font-medium">{qe.exam.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('dialog.status')}: {qe.exam.status}
                        </p>
                      </div>
                      <Badge variant="outline">{t('dialog.points', { points: qe.points })}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">{t('dialog.created')}: </span>
              <span>{formatDate(question.created_at)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('dialog.lastUpdated')}: </span>
              <span>{formatDate(question.updated_at)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('dialog.questionId')}: </span>
              <span className="font-mono">#{question.question_id}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{t('dialog.creatorId')}: </span>
              <span className="font-mono">#{question.created_by}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
