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

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
  onView: (question: Question) => void
}

export function QuestionList({ questions, onEdit, onDelete, onView }: QuestionListProps) {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'Multiple Choice'
      case 'essay':
        return 'Essay'
      default:
        return type
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No questions found.</p>
        <p className="text-sm mt-2">Create your first question to get started.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="min-w-[300px]">Question</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Visibility</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                      {question.options.length} options
                      {question.is_multiple_answer && ' • Multiple answers'}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getTypeLabel(question.type)}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </TableCell>
              <TableCell>
                {question.category ? (
                  <span className="text-sm">{question.category.name}</span>
                ) : (
                  <span className="text-sm text-muted-foreground">No category</span>
                )}
              </TableCell>
              <TableCell>
                {question.is_public ? (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Unlock className="h-3 w-3" />
                    Public
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Private
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(question)}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canUpdateQuestion && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(question)}
                      title="Edit question"
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
                      title="Delete question"
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
