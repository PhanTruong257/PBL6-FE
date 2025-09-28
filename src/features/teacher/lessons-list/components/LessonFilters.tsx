import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Filter, X } from 'lucide-react'
import type { LessonFilters } from '../types'

interface LessonFiltersProps {
  filters: LessonFilters
  onFilterChange: (key: keyof LessonFilters, value: string | boolean | undefined) => void
  onResetFilters: () => void
  activeFiltersCount: number
  courses?: { id: string; title: string }[]
}

export const LessonFiltersComponent: React.FC<LessonFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  activeFiltersCount,
  courses = []
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Khóa học:</span>
          <Select
            value={filters.courseId || ''}
            onValueChange={(value) => onFilterChange('courseId', value || undefined)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Chọn khóa học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả khóa học</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Trạng thái:</span>
          <Select
            value={filters.isPublished === undefined ? '' : String(filters.isPublished)}
            onValueChange={(value) => {
              if (value === '') {
                onFilterChange('isPublished', undefined)
              } else {
                onFilterChange('isPublished', value === 'true')
              }
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tất cả</SelectItem>
              <SelectItem value="true">Đã xuất bản</SelectItem>
              <SelectItem value="false">Bản nháp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sắp xếp:</span>
          <Select
            value={filters.sortBy || 'createdAt'}
            onValueChange={(value) => onFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Ngày tạo</SelectItem>
              <SelectItem value="title">Tiêu đề</SelectItem>
              <SelectItem value="duration">Thời lượng</SelectItem>
              <SelectItem value="viewCount">Lượt xem</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.sortOrder || 'desc'}
            onValueChange={(value) => onFilterChange('sortOrder', value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Giảm dần</SelectItem>
              <SelectItem value="asc">Tăng dần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="flex items-center gap-2"
          >
            <X className="h-3 w-3" />
            Xóa bộ lọc ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
          
          {filters.courseId && (
            <Badge variant="outline" className="flex items-center gap-1">
              Khóa học được chọn
              <button
                onClick={() => onFilterChange('courseId', undefined)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.isPublished !== undefined && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filters.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
              <button
                onClick={() => onFilterChange('isPublished', undefined)}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}