import { useState, useRef, useEffect, useCallback } from 'react'
import { X, ChevronDown, Search, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import type { QuestionCategory } from '@/types/question'
import { useQuestionsTranslation } from '../hooks'

interface CategoryFilterProps {
  categories: QuestionCategory[]
  selectedCategoryIds: number[]
  onSelectionChange: (ids: number[]) => void
}

export function CategoryFilter({
  categories,
  selectedCategoryIds,
  onSelectionChange,
}: CategoryFilterProps) {
  const { t } = useQuestionsTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get selected categories with their data
  const selectedCategories = categories.filter((cat) =>
    selectedCategoryIds.includes(cat.category_id)
  )

  // Calculate total questions for selected categories
  const totalSelectedQuestions = selectedCategories.reduce(
    (sum, cat) => sum + (cat.question_count || 0),
    0
  )

  // Handle category toggle
  const handleToggleCategory = useCallback(
    (categoryId: number) => {
      const isSelected = selectedCategoryIds.includes(categoryId)
      if (isSelected) {
        onSelectionChange(selectedCategoryIds.filter((id) => id !== categoryId))
      } else {
        onSelectionChange([...selectedCategoryIds, categoryId])
      }
    },
    [selectedCategoryIds, onSelectionChange]
  )

  // Handle remove category
  const handleRemoveCategory = useCallback(
    (categoryId: number) => {
      onSelectionChange(selectedCategoryIds.filter((id) => id !== categoryId))
    },
    [selectedCategoryIds, onSelectionChange]
  )

  // Handle clear all
  const handleClearAll = useCallback(() => {
    onSelectionChange([])
    setSearchQuery('')
  }, [onSelectionChange])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Main Input/Display Area */}
      <div
        className={cn(
          'flex flex-wrap items-center gap-2 min-h-[42px] p-2 border rounded-lg cursor-pointer',
          'bg-background hover:border-primary/50 transition-colors',
          isOpen && 'ring-2 ring-primary/20 border-primary'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Selected Category Tags */}
        {selectedCategoryIds.length === 0 ? (
          <span className="text-muted-foreground text-sm px-1">
            {t('filter.allCategories')}
          </span>
        ) : (
          <>
            {selectedCategories.map((category) => (
              <Badge
                key={category.category_id}
                variant="secondary"
                className="flex items-center gap-1 py-1 px-2"
              >
                <span className="max-w-[120px] truncate">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({category.question_count || 0})
                </span>
                <button
                  type="button"
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveCategory(category.category_id)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </>
        )}

        {/* Right side indicator */}
        <div className="ml-auto flex items-center gap-2">
          {selectedCategoryIds.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {t('filter.questionsCount', { count: totalSelectedQuestions })}
            </span>
          )}
          <ChevronDown
            className={cn('h-4 w-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('filter.searchCategories')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Clear All Button */}
          {selectedCategoryIds.length > 0 && (
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearAll()
                }}
              >
                <X className="h-4 w-4 mr-2" />
                {t('filter.clearAll')}
              </Button>
            </div>
          )}

          {/* Category List */}
          <div className="max-h-[250px] overflow-y-auto p-1">
            {filteredCategories.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t('filter.noCategories')}
              </div>
            ) : (
              filteredCategories.map((category) => {
                const isSelected = selectedCategoryIds.includes(category.category_id)
                return (
                  <button
                    key={category.category_id}
                    type="button"
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2 rounded-md text-left',
                      'hover:bg-accent transition-colors',
                      isSelected && 'bg-accent'
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleCategory(category.category_id)
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate block">{category.name}</span>
                      {category.description && (
                        <span className="text-xs text-muted-foreground truncate block">
                          {category.description}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-sm text-muted-foreground">
                        {category.question_count || 0}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
