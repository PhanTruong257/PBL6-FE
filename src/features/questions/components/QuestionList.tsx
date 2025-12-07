import { Pencil, Trash2, Eye, Lock, Unlock } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { userPermissionsSelector } from '@/global/recoil/user/userSelectorFamily'
import type { Question } from '@/types/question'
import { useQuestionsTranslation } from '../hooks'

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
  onView: (question: Question) => void
}

export function QuestionList({ questions, onEdit, onDelete, onView }: QuestionListProps) {
  const { t } = useQuestionsTranslation()
  
  // Get user permissions
  const userPermissions = useRecoilValue(userPermissionsSelector)
  
  // Check permissions
  const canUpdateQuestion = userPermissions.some(
    p => p.resource === 'questions' && p.action === 'update'
  )
  const canDeleteQuestion = userPermissions.some(
    p => p.resource === 'questions' && p.action === 'delete'
  )
  
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{t('grid.noQuestions')}</p>
        <p className="text-sm mt-2">{t('grid.noQuestionsHint')}</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="min-w-[300px]">{t('dialog.questionLabel')}</TableHead>
            <TableHead>{t('form.type')}</TableHead>
            <TableHead>{t('form.difficulty')}</TableHead>
            <TableHead>{t('form.category')}</TableHead>
            <TableHead>{t('visibility.public')}</TableHead>
            <TableHead className="text-right">{t('actions.view')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => (
            <TableRow key={question.question_id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="max-w-md">
                  <p className="line-clamp-2 font-medium">{question.content}</p>
                  {question.type === 'multiple_choice' && question.options && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {question.options.length} {t('form.options').toLowerCase()}
                      {question.is_multiple_answer && ` • ${t('form.isMultipleAnswer')}`}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {t(`types.${question.type === 'multiple_choice' ? 'multipleChoice' : 'essay'}`)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {t(`difficulty.${question.difficulty}`)}
                </Badge>
              </TableCell>
              <TableCell>
                {question.category ? (
                  <span className="text-sm">{question.category.name}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">{t('form.noCategory')}</span>
                )}
              </TableCell>
              <TableCell>
                {question.is_public ? (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Unlock className="h-3 w-3" />
                    {t('visibility.public')}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    {t('visibility.private')}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(question)}
                    title={t('actions.view')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canUpdateQuestion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(question)}
                      title={t('actions.edit')}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {canDeleteQuestion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(question)}
                      className="text-destructive hover:text-destructive"
                      title={t('actions.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
