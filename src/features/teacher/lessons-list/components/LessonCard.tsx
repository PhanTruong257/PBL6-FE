import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Play, Edit, Trash2, Eye } from 'lucide-react'
import type { Lesson } from '../types'
import { formatDuration, getStatusColor, getStatusText } from '../utils'

interface LessonCardProps {
  lesson: Lesson
  onEdit: (lesson: Lesson) => void
  onDelete: (lesson: Lesson) => void
  onTogglePublish: (lesson: Lesson) => void
  onPreview: (lesson: Lesson) => void
  isLoading?: boolean
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  onEdit,
  onDelete,
  onTogglePublish,
  onPreview,
  isLoading = false
}) => {
  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {lesson.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              {lesson.courseName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={getStatusColor(lesson.isPublished)}
            >
              {getStatusText(lesson.isPublished)}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {lesson.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span>{formatDuration(lesson.duration)}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {lesson.viewCount} lượt xem
            </span>
          </div>
          <span>Thứ tự: {lesson.order}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {lesson.videoUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(lesson)}
              className="flex items-center gap-2"
            >
              <Play className="h-3 w-3" />
              Xem trước
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(lesson)}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Edit className="h-3 w-3" />
            Chỉnh sửa
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePublish(lesson)}
            disabled={isLoading}
          >
            {lesson.isPublished ? 'Ẩn' : 'Xuất bản'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(lesson)}
            className="text-red-600 hover:text-red-700"
            disabled={isLoading}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}