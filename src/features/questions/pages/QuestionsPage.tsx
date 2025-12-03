import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { Plus, Grid3x3, List, Download, Upload, FileText, FileSpreadsheet, FileType } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  CategoryManager,
  QuestionForm,
  QuestionList,
  QuestionGrid,
  QuestionDetailDialog,
  QuestionStats,
  SearchBar,
  ImportExcelDialog,
} from '../components'
import {
  useCategories,
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useQuestion,
  useQuestionsTranslation,
} from '../hooks'
import { questionsApi } from '../apis/questions-service'
import { userPermissionsSelector, currentUserState } from '@/global/recoil/user'
import { userRoleSelector } from '@/global/recoil/user/userSelector'
import type { Question, QuestionFilterParams } from '@/types/question'
import type { QuestionFormValues, SearchFormValues } from '../schemas/question-schema'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/libs/utils'
import { toast } from '@/libs'

export function QuestionsPage() {
  const navigate = useNavigate()
  const { t } = useQuestionsTranslation()
  
  // ============================================
  // ALL STATE AND HOOKS MUST BE DECLARED FIRST
  // BEFORE ANY CONDITIONAL RETURNS (React Rules of Hooks)
  // ============================================
  // Local State
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>()
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [viewingQuestionId, setViewingQuestionId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<QuestionFilterParams>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  
  // Constants
  const limit = 10
  
  // Recoil State
  const currentUser = useRecoilValue(currentUserState)
  const userPermissions = useRecoilValue(userPermissionsSelector)
  const userRole = useRecoilValue(userRoleSelector)
  
  // API Hooks
  const { data: categoriesData } = useCategories()
  const categories = categoriesData || []
  
  const questionsParams: QuestionFilterParams = {
    ...filters,
    category_id: selectedCategoryId,
    page: currentPage,
    limit,
  }
  const { data: questionsData, isLoading } = useQuestions(questionsParams)
  const { data: viewingQuestion } = useQuestion(viewingQuestionId || 0)
  
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deleteMutation = useDeleteQuestion()
  
  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAccess(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Derived State
  const hasAccess = userRole === 'admin' || userRole === 'teacher'
  const canCreateQuestion = userPermissions.some(
    p => p.resource === 'questions' && p.action === 'create'
  )
  const questions = questionsData?.data || []
  const totalPages = questionsData?.meta.totalPages || 1
  const totalQuestions = questionsData?.meta.total || 0
  
  // ============================================
  // CONDITIONAL RETURNS (After all hooks)
  // ============================================
  // Show loading while checking access
  if (isCheckingAccess) {
    return (
      <div className="container mx-auto py-6 max-w-[1800px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-muted-foreground">{t('page.checkingAccess')}</p>
          </div>
        </div>
      </div>
    )
  }

  // After loading, check if user has access
  if (!hasAccess) {
    return (
      <div className="container mx-auto py-6 max-w-[1800px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold mb-2">{t('page.noAccess')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('page.noAccessMessage')}
            </p>
            <Button onClick={() => navigate({ to: '/dashboard' })}>
              {t('actions.backToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleSearch = (values: SearchFormValues) => {
    setFilters({
      ...values,
      category_id: values.category_id ?? undefined,
    })
    setCurrentPage(1)
  }

  const handleOpenForm = (question?: Question) => {
    setEditingQuestion(question || null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setEditingQuestion(null)
    setIsFormOpen(false)
  }

  const handleSubmitForm = async (values: QuestionFormValues) => {
    try {
      // Validate user authentication
      if (!currentUser?.user_id) {
        toast.error('Bạn cần đăng nhập để thực hiện thao tác này')
        return
      }

      const submitData = {
        ...values,
        category_id: values.category_id ?? undefined,
        created_by: currentUser.user_id, // Add user ID to request
      }
      
      if (editingQuestion) {
        await updateMutation.mutateAsync({ id: editingQuestion.question_id, data: submitData })
      } else {
        await createMutation.mutateAsync(submitData)
      }
      handleCloseForm()
    } catch (error) {}
  }

  const handleDeleteQuestion = (question: Question) => {
    setQuestionToDelete(question)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!questionToDelete) return

    try {
      await deleteMutation.mutateAsync(questionToDelete.question_id)
      // Toast message already shown in hook
    } catch (error) {
      // Error handled by hook
    } finally {
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    }
  }

  const handleViewQuestion = (question: Question) => {
    setViewingQuestionId(question.question_id)
  }

  const handleExport = async (format: 'excel' | 'text' | 'docx') => {
    try {
      const exportParams = {
        ...filters,
        category_id: selectedCategoryId,
      }

      if (format === 'excel') {
        await questionsApi.exportToExcel(exportParams)
        toast.success(t('messages.exportSuccess', { format: 'Excel' }))
      } else if (format === 'text') {
        await questionsApi.exportToText(exportParams)
        toast.success(t('messages.exportSuccess', { format: 'Text' }))
      } else {
        await questionsApi.exportToDocx(exportParams)
        toast.success(t('messages.exportSuccess', { format: 'Word' }))
      }
    } catch (error: any) {
      toast.error(error?.message || t('messages.exportError', { format }))
    }
  }

  return (
    <div className="container mx-auto max-w-[1800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-5 w-5 mr-2" />
            {t('actions.import')}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg">
                <Download className="h-5 w-5 mr-2" />
                {t('actions.export')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                {t('export.excel')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('text')}>
                <FileText className="h-4 w-4 mr-2" />
                {t('export.text')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('docx')}>
                <FileType className="h-4 w-4 mr-2" />
                {t('export.word')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {canCreateQuestion && (
            <Button onClick={() => handleOpenForm()} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              {t('createQuestion')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4 w-full lg:w-[280px]">
          <div className="sticky top-6 space-y-4">
            {/* Category Manager */}
            <CategoryManager
              categories={categories}
              onCategoriesChange={() => {}}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />
            
            {/* Statistics */}
            <QuestionStats questions={questions} />
          </div>
        </div>

        {/* Main Content - Questions */}
        <div className="space-y-4 min-w-0 flex-1">
          {/* Search Bar */}
          <div className="bg-card rounded-lg border p-4">
            <SearchBar
              categories={categories}
              onSearch={handleSearch}
              defaultValues={filters}
            />
          </div>

          {/* Content Header with View Toggle */}
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{t('page.questionList')}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('view.showing', { 
                    from: questions.length > 0 ? (currentPage - 1) * limit + 1 : 0,
                    to: Math.min(currentPage * limit, totalQuestions),
                    total: totalQuestions
                  })}
                </p>
              </div>
              
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(viewMode === 'grid' && 'shadow-sm')}
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  {t('view.grid')}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(viewMode === 'list' && 'shadow-sm')}
                >
                  <List className="h-4 w-4 mr-2" />
                  {t('view.list')}
                </Button>
              </div>
            </div>
          </div>

          {/* Questions Display */}
          {isLoading ? (
            <div className="bg-card rounded-lg border p-12 text-center text-muted-foreground">
              <div className="text-4xl mb-4">⏳</div>
              {t('loading')}
            </div>
          ) : viewMode === 'grid' ? (
            <QuestionGrid
              questions={questions}
              onEdit={handleOpenForm}
              onDelete={handleDeleteQuestion}
              onView={handleViewQuestion}
            />
          ) : (
            <QuestionList
              questions={questions}
              onEdit={handleOpenForm}
              onDelete={handleDeleteQuestion}
              onView={handleViewQuestion}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Question Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? t('dialog.editTitle') : t('dialog.createTitle')}
            </DialogTitle>
          </DialogHeader>
          {categories.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {t('dialog.loadingCategories')}
            </div>
          ) : (
            <QuestionForm
              question={editingQuestion || undefined}
              categories={categories}
              onSubmit={handleSubmitForm}
              onCancel={handleCloseForm}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Question Detail Dialog */}
      <QuestionDetailDialog
        open={!!viewingQuestionId}
        onClose={() => setViewingQuestionId(null)}
        question={viewingQuestion || null}
      />

      {/* Import Excel Dialog */}
      <ImportExcelDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dialog.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dialog.deleteDescription')}
              {questionToDelete && (
                <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                  "{questionToDelete.content.substring(0, 100)}
                  {questionToDelete.content.length > 100 ? '...' : ''}"
                </div>
              )}
              {t('dialog.deleteDescriptionDetail')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setQuestionToDelete(null)}>
                {t('actions.cancel')}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={confirmDelete} 
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {t('actions.delete')}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
