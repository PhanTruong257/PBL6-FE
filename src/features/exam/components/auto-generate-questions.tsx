import { useState, useMemo, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, X, Search, Plus, AlertCircle, Loader2 } from 'lucide-react'
import { useQuestionCategories } from '../hooks'
import { toast } from 'sonner'
import type { QuestionCategory } from '@/types/exam'

interface AutoGenerateQuestionsProps {
  onGenerate: (config: AutoGenerateConfig) => void
  isGenerating?: boolean
}

export interface AutoGenerateConfig {
  criteria: Array<{
    categoryId: number
    categoryName: string
    questionType?: string
    count: number
  }>
}

interface Criterion {
  id: string
  categoryId: number
  categoryName: string
  questionType: string
  count: number
}

  const QUESTION_TYPES = [
    { value: 'multiple_choice', label: 'Trắc nghiệm' },
    { value: 'true_false', label: 'Đúng/Sai' },
    { value: 'essay', label: 'Tự luận' },
  ]

export function AutoGenerateQuestions({ onGenerate, isGenerating = false }: AutoGenerateQuestionsProps) {
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: '1', categoryId: 0, categoryName: '', questionType: '', count: 0 },
  ])
  const [searchTags, setSearchTags] = useState<string[]>([''])
  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null)

  // Fetch categories from API with search
  const searchQuery = useMemo(() => {
    if (activeSearchIndex !== null) {
      return searchTags[activeSearchIndex] || ''
    }
    return ''
  }, [activeSearchIndex, searchTags])

  const { data: categories = [], isLoading: isLoadingCategories } = useQuestionCategories(searchQuery)

  console.log('Fetched categories:', categories)

  // Create a map for quick category lookup and validation
  const categoryMap = useMemo(() => {
    const map = new Map<number, QuestionCategory>()
    categories.forEach(cat => map.set(cat.category_id, cat))
    return map
  }, [categories])

  useEffect(() => {    
  }, [criteria[0]])

  const addCriterion = () => {
    const newId = (criteria.length + 1).toString()
    setCriteria([...criteria, { id: newId, categoryId: 0, categoryName: '', questionType: '', count: 0 }])
    setSearchTags([...searchTags, ''])
  }

  const removeCriterion = (id: string) => {
    // if (criteria.length === 1) return
    const index = criteria.findIndex((c) => c.id === id)
    setCriteria(criteria.filter((c) => c.id !== id))
    setSearchTags(searchTags.filter((_, i) => i !== index))
  }

  const updateCriterion = (id: string, field: keyof Criterion, value: any) => {
    setCriteria(criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const selectCategory = (index: number, category: QuestionCategory) => {
    criteria[index].categoryId = category.category_id
    criteria[index].categoryName = category.name
    setSearchTags(searchTags.map((t, i) => (i === index ? '' : t)))
    setActiveSearchIndex(null)
  }

  const clearCategory = (index: number) => {
    criteria[index].categoryId = 0
    criteria[index].categoryName = ''
    setSearchTags(searchTags.map((t, i) => (i === index ? '' : t)))
    setActiveSearchIndex(null)
  }

  const handleSearchChange = (index: number, value: string) => {
    setSearchTags(searchTags.map((t, i) => (i === index ? value : t)))
    setActiveSearchIndex(value ? index : null)
  }

  const getMaxQuestions = (categoryId: number): number => {
    // If categoryId is 0 or invalid, return 0
    if (!categoryId || categoryId === 0) {
      return 0
    }
    const category = categoryMap.get(categoryId)
    return category?.question_count || 0
  }

  const validateCriterion = (criterion: Criterion): { isValid: boolean; error?: string } => {
    if (!criterion.categoryId || !criterion.categoryName) {
      return { isValid: false }
    }
    if (!criterion.questionType) {
      return { isValid: false }
    }
    if (!criterion.count || criterion.count <= 0) {
      return { isValid: false }
    }

    const maxQuestions = getMaxQuestions(criterion.categoryId)
    if (criterion.count > maxQuestions) {
      return { 
        isValid: false,
        error: `Chỉ có tối đa ${maxQuestions} câu hỏi` 
      }
    }

    return { isValid: true }
  }

  const handleGenerate = () => {
    // Validate all criteria
    const validationResults = criteria.map(c => ({
      criterion: c,
      validation: validateCriterion(c)
    }))

    const invalidCriteria = validationResults.filter(r => !r.validation.isValid)
    
    if (invalidCriteria.length === criteria.length) {
      toast.error('Vui lòng điền đầy đủ thông tin cho ít nhất một điều kiện')
      return
    }

    const validCriteria = validationResults
      .filter(r => r.validation.isValid)
      .map(r => r.criterion)

    if (validCriteria.length === 0) return

    const config: AutoGenerateConfig = {
      criteria: validCriteria.map((c) => ({
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        questionType: c.questionType,
        count: c.count,
      })),
    }

    onGenerate(config)
  }

  const totalQuestions = criteria.reduce((sum, c) => {
    const validation = validateCriterion(c)
    return validation.isValid ? sum + c.count : sum
  }, 0)

  const hasAnyValidCriterion = criteria.some((c) => validateCriterion(c).isValid)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Tự động tạo câu hỏi</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Chọn category, loại câu hỏi và số lượng để tự động tạo danh sách câu hỏi
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Tổng: {totalQuestions} câu
        </Badge>
      </div>

      {/* Criteria List */}
      <div className="space-y-4">
        {criteria.map((criterion, index) => {
          const validation = validateCriterion(criterion)
          const maxQuestions = getMaxQuestions(criterion.categoryId)
          const showError = criterion.categoryId > 0 && criterion.count > 0 && !validation.isValid && validation.error

          return (
            <div
              key={criterion.id}
              className="relative rounded-lg border bg-card p-4 transition-all hover:shadow-sm"
            >
              {/* Remove Button */}
              {criteria.length > 0 && (
                <button
                  onClick={() => removeCriterion(criterion.id)}
                  className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-12 pr-8">
                {/* Category Selection */}
                <div className="space-y-2 md:col-span-5 relative">
                  <Label htmlFor={`category-${criterion.id}`} className="text-sm font-medium flex items-center gap-1">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  
                  {criterion.categoryName ? (
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="h-11 px-3 text-sm flex items-center gap-2 flex-1 justify-between"
                      >
                        <span className="flex items-center gap-2">
                          {criterion.categoryName}
                          <span className="text-xs text-muted-foreground">
                            ({maxQuestions} câu)
                          </span>
                        </span>
                        <button
                          onClick={() => clearCategory(index)}
                          className="ml-2 hover:text-destructive"
                          type="button"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={`category-${criterion.id}`}
                          placeholder="Tìm kiếm category..."
                          value={searchTags[index] || ''}
                          onChange={(e) => handleSearchChange(index, e.target.value)}
                          onFocus={() => setActiveSearchIndex(index)}
                          className="h-11 pl-9"
                        />
                      </div>
                      
                      {/* Category Dropdown */}
                      {activeSearchIndex === index && (
                        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover shadow-lg">
                          {isLoadingCategories ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                          ) : categories.length > 0 ? (
                            <div className="p-1">
                              {categories.map((category) => (
                                <button
                                  key={category.category_id}
                                  onClick={() => selectCategory(index, category)}
                                  className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between"
                                  type="button"
                                >
                                  <span>{category.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {category.question_count} câu
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              Không tìm thấy category
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Question Type */}
                <div className="space-y-2 md:col-span-4">
                  <Label htmlFor={`type-${criterion.id}`} className="text-sm font-medium flex items-center gap-1">
                    Loại câu hỏi <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id={`type-${criterion.id}`}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={criterion.questionType}
                    onChange={(e) => updateCriterion(criterion.id, 'questionType', e.target.value)}
                  >
                    <option value="">-- Chọn loại --</option>
                    {QUESTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Count */}
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor={`count-${criterion.id}`} className="text-sm font-medium flex items-center gap-1">
                    Số lượng <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`count-${criterion.id}`}
                    type="number"
                    min="0"
                    max={maxQuestions || undefined}
                    placeholder="0"
                    value={criterion.count || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      updateCriterion(criterion.id, 'count', value)
                    }}
                    className={`h-11 ${showError ? 'border-destructive' : ''}`}
                  />
                </div>
              </div>

              {/* Error Message */}
              {showError && (
                <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{validation.error}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Button */}
      <Button
        onClick={addCriterion}
        variant="outline"
        className="w-full border-dashed"
        type="button"
      >
        <Plus className="mr-2 h-4 w-4" />
        Thêm điều kiện
      </Button>

      {/* Generate Button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleGenerate}
          disabled={!hasAnyValidCriterion || isGenerating}
          className="min-w-[160px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          type="button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Tạo danh sách câu hỏi
            </>
          )}
        </Button>
      </div>

      {/* Click outside handler */}
      {activeSearchIndex !== null && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveSearchIndex(null)}
        />
      )}
    </div>
  )
}
