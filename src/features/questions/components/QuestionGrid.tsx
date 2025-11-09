import { useRecoilValue } from 'recoil'
import { Edit, Copy, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Question } from '@/types/question'
import { userPermissionsSelector } from '@/global/recoil/user/userSelectorFamily'
import { cn } from '@/libs/utils'

interface QuestionGridProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (question: Question) => void
  onView: (question: Question) => void
  onDuplicate?: (question: Question) => void
}

export function QuestionGrid({
  questions,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
}: QuestionGridProps) {
  // Get user permissions
  const userPermissions = useRecoilValue(userPermissionsSelector)

  // Check permissions
  const canUpdateQuestion = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'update'
  )
  const canDeleteQuestion = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'delete'
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
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'essay':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return '📝 Trắc nghiệm'
      case 'essay':
        return '✍️ Tự luận'
      default:
        return type
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ'
      case 'medium':
        return 'Trung bình'
      case 'hard':
        return 'Khó'
      default:
        return difficulty
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Không tìm thấy câu hỏi
        </h3>
        <p className="text-gray-500">
          Thử thay đổi bộ lọc hoặc tạo câu hỏi mới
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {questions.map((question) => (
        <div
          key={question.question_id}
          className={cn(
            'bg-card border rounded-lg p-4 transition-all duration-200',
            'hover:shadow-lg hover:border-primary hover:-translate-y-1',
            'cursor-pointer relative group'
          )}
          onClick={() => onView(question)}
        >
          {/* Header - ID and Badges */}
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold text-muted-foreground">
              #{question.question_id}
            </span>
            <div className="flex gap-2 flex-wrap justify-end">
              <Badge className={getTypeColor(question.type)} variant="secondary">
                {getTypeLabel(question.type)}
              </Badge>
              <Badge
                className={getDifficultyColor(question.difficulty)}
                variant="secondary"
              >
                {getDifficultyLabel(question.difficulty)}
              </Badge>
            </div>
          </div>

          {/* Question Content */}
          <div className="font-semibold text-sm mb-3 line-clamp-3 min-h-[60px]">
            {question.content}
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {question.category && (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-semibold">
                📁 {question.category.name}
              </span>
            )}
            {question.is_public ? (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-semibold">
                🌐 Public
              </span>
            ) : (
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-semibold">
                🔒 Private
              </span>
            )}
          </div>

          {/* Actions */}
          <div
            className="flex gap-2 pt-3 border-t"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onView(question)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Xem
            </Button>
            {canUpdateQuestion && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => onEdit(question)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Sửa
              </Button>
            )}
            {onDuplicate && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onDuplicate(question)}
                title="Nhân bản"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
            {canDeleteQuestion && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onDelete(question)}
                title="Xóa"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
