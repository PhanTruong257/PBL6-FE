import { useState, useMemo } from 'react'
import type { LessonFilters } from '../types'

export const useLessonFilters = () => {
  const [filters, setFilters] = useState<LessonFilters>({
    search: '',
    courseId: '',
    isPublished: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })

  const updateFilter = (key: keyof LessonFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      courseId: '',
      isPublished: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
  }

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.courseId) count++
    if (filters.isPublished !== undefined) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFiltersCount > 0

  return {
    filters,
    updateFilter,
    resetFilters,
    activeFiltersCount,
    hasActiveFilters,
  }
}