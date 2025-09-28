import React, { useState } from 'react'
import { LessonsList, LessonFiltersComponent, LessonSearch, QuickActions } from './components'
import { useLessons, useLessonFilters, useLessonActions } from './hooks'
import type { Lesson } from './types'

export const LessonsListPage: React.FC = () => {
  const { filters, updateFilter, resetFilters, activeFiltersCount } = useLessonFilters()
  const { data: lessons = [], isLoading, error } = useLessons(filters)
  const { handleDeleteLesson, handleTogglePublish: togglePublishAction } = useLessonActions()
  
  const [selectedLessons] = useState<string[]>([])

  const handleEdit = (lesson: Lesson) => {
    console.log('Edit lesson:', lesson)
    // Navigate to edit page
  }

  const handleDelete = async (lesson: Lesson) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa bài học "${lesson.title}"?`)
    if (confirmed) {
      await handleDeleteLesson(lesson.id, lesson.title)
    }
  }

  const handleTogglePublish = async (lesson: Lesson) => {
    await togglePublishAction(lesson.id, !lesson.isPublished, lesson.title)
  }

  const handlePreview = (lesson: Lesson) => {
    console.log('Preview lesson:', lesson)
    // Open preview modal or navigate to preview page
  }

  const handleCreateLesson = () => {
    console.log('Create new lesson')
    // Navigate to create lesson page
  }

  const handleImportLessons = () => {
    console.log('Import lessons')
    // Open import modal
  }

  const handleExportLessons = () => {
    console.log('Export lessons')
    // Export selected or all lessons
  }

  const handleBulkActions = () => {
    console.log('Bulk actions for:', selectedLessons)
    // Open bulk actions modal
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Lỗi tải dữ liệu</div>
          <div className="text-gray-600">
            Không thể tải danh sách bài học. Vui lòng thử lại.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài học</h1>
          <p className="text-gray-600 mt-1">
            Quản lý và tổ chức các bài học trong khóa học của bạn
          </p>
        </div>
        <QuickActions
          onCreateLesson={handleCreateLesson}
          onImportLessons={handleImportLessons}
          onExportLessons={handleExportLessons}
          onBulkActions={handleBulkActions}
          selectedCount={selectedLessons.length}
        />
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <LessonSearch
              value={filters.search || ''}
              onChange={(value) => updateFilter('search', value)}
              placeholder="Tìm kiếm bài học theo tên, mô tả..."
            />
          </div>
          <div className="text-sm text-gray-500">
            {lessons.length} bài học
          </div>
        </div>

        <LessonFiltersComponent
          filters={filters}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          activeFiltersCount={activeFiltersCount}
          courses={[]} // TODO: Load courses from API
        />
      </div>

      {/* Lessons List */}
      <LessonsList
        lessons={lessons}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
        onPreview={handlePreview}
      />
    </div>
  )
}