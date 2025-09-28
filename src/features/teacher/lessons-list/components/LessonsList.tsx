import React from 'react'
import { LessonCard } from './LessonCard'
import type { Lesson } from '../types'

interface LessonsListProps {
  lessons: Lesson[]
  isLoading?: boolean
  onEdit: (lesson: Lesson) => void
  onDelete: (lesson: Lesson) => void
  onTogglePublish: (lesson: Lesson) => void
  onPreview: (lesson: Lesson) => void
}

export const LessonsList: React.FC<LessonsListProps> = ({
  lessons,
  isLoading = false,
  onEdit,
  onDelete,
  onTogglePublish,
  onPreview
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-64"></div>
          </div>
        ))}
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">Chưa có bài học nào</div>
        <div className="text-gray-400 text-sm">
          Tạo bài học đầu tiên để bắt đầu khóa học của bạn
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePublish={onTogglePublish}
          onPreview={onPreview}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}