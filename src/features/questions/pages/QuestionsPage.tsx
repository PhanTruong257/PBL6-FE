import {
  Plus,
  Grid3x3,
  List,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  FileType,
} from 'lucide-react'
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
  CategoryFilter,
  QuestionForm,
  QuestionList,
  QuestionGrid,
  QuestionDetailDialog,
  QuestionStats,
  SearchBar,
  ImportExcelDialog,
} from '../components'
import { useQuestionsPage, useQuestionsTranslation } from '../hooks'
import { cn } from '@/libs/utils'

export function QuestionsPage() {
  const { t } = useQuestionsTranslation()
  const {
    // State
    selectedCategoryIds,
    setSelectedCategoryIds,
    editingQuestion,
    viewingQuestionId,
    isFormOpen,
    isImportDialogOpen,
    viewMode,
    setViewMode,
    isCheckingAccess,
    currentPage,
    filters,
    deleteDialogOpen,
    setDeleteDialogOpen,
    questionToDelete,

    // Data
    categories,
    questions,
    viewingQuestion,
    totalPages,
    totalQuestions,
    isLoading,
    limit,

    // Permissions
    hasAccess,
    canCreateQuestion,
    canExportExcel,
    canExportText,
    canExportDocx,
    canImport,

    // Mutations state
    isSubmitting,

    // Handlers
    handleSearch,
    handleOpenForm,
    handleCloseForm,
    handleSubmitForm,
    handleDeleteQuestion,
    confirmDelete,
    cancelDelete,
    handleViewQuestion,
    closeViewDialog,
    handleExport,
    handlePageChange,
    navigateToDashboard,
    openImportDialog,
    closeImportDialog,
  } = useQuestionsPage()

  // ============================================
  // CONDITIONAL RENDERS
  // ============================================
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
            <Button onClick={navigateToDashboard}>
              {t('actions.backToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // PAGINATION HELPERS
  // ============================================
  const renderPaginationItems = () => {
    return Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
            onClick={() => handlePageChange(pageNum)}
            isActive={currentPage === pageNum}
            className="cursor-pointer"
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      )
    })
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="container mx-auto max-w-[1800px] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {canImport && (
            <Button variant="outline" size="lg" onClick={openImportDialog}>
              <Upload className="h-5 w-5 mr-2" />
              {t('actions.import')}
            </Button>
          )}

          {(canExportExcel || canExportText || canExportDocx) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  {t('actions.export')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canExportExcel && (
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    {t('export.excel')}
                  </DropdownMenuItem>
                )}
                {canExportText && (
                  <DropdownMenuItem onClick={() => handleExport('text')}>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('export.text')}
                  </DropdownMenuItem>
                )}
                {canExportDocx && (
                  <DropdownMenuItem onClick={() => handleExport('docx')}>
                    <FileType className="h-4 w-4 mr-2" />
                    {t('export.word')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {t('category.title')}
              </h3>
              <CategoryFilter
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onSelectionChange={setSelectedCategoryIds}
              />
            </div>
            <QuestionStats
              questions={questions}
              totalQuestions={totalQuestions}
            />
          </div>
        </div>

        {/* Main Content */}
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
                    from:
                      questions.length > 0 ? (currentPage - 1) * limit + 1 : 0,
                    to: Math.min(currentPage * limit, totalQuestions),
                    total: totalQuestions,
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
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Question Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion
                ? t('dialog.editTitle')
                : t('dialog.createTitle')}
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
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Question Detail Dialog */}
      <QuestionDetailDialog
        open={!!viewingQuestionId}
        onClose={closeViewDialog}
        question={viewingQuestion || null}
      />

      {/* Import Excel Dialog */}
      <ImportExcelDialog
        open={isImportDialogOpen}
        onOpenChange={closeImportDialog}
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
              <Button variant="outline" onClick={cancelDelete}>
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
