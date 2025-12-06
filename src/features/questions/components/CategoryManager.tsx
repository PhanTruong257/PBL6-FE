import { Plus, Pencil, Trash2, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCategoryManager, useQuestionsTranslation } from '../hooks'
import type { QuestionCategory } from '@/types/question'

interface CategoryManagerProps {
  categories: QuestionCategory[]
  onCategoriesChange: () => void
  selectedCategoryId?: number
  onSelectCategory: (categoryId?: number) => void
}

export function CategoryManager({
  categories,
  onCategoriesChange,
  selectedCategoryId,
  onSelectCategory,
}: CategoryManagerProps) {
  const { t } = useQuestionsTranslation()
  const {
    // Form
    form,

    // State
    isDialogOpen,
    setIsDialogOpen,
    editingCategory,
    deleteDialogOpen,
    setDeleteDialogOpen,
    categoryToDelete,

    // Permissions
    canCreateCategory,
    canUpdateCategory,
    canDeleteCategory,

    // Handlers
    handleOpenDialog,
    handleCloseDialog,
    handleSubmit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    handleSelectAll,
    handleSelectCategory,
  } = useCategoryManager({
    onCategoriesChange,
    selectedCategoryId,
    onSelectCategory,
  })

  // ============================================
  // COMPUTED VALUES
  // ============================================
  const totalQuestionsCount = categories.reduce((sum, cat) => sum + (cat.question_count || 0), 0)

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Folder className="h-5 w-5" />
          {t('category.title')}
        </h3>
        {canCreateCategory && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                {t('category.newCategory')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? t('category.edit') : t('category.create')}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('category.name')} *</FormLabel>
                        <FormControl>
                          <Input placeholder={t('category.namePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('category.description')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('category.descriptionPlaceholder')} {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      {t('actions.cancel')}
                    </Button>
                    <Button type="submit">{editingCategory ? t('actions.update') : t('actions.create')}</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-2">
        {/* All Questions Button */}
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            !selectedCategoryId ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
          }`}
          onClick={handleSelectAll}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('category.allQuestions')}</span>
            <span
              className={`text-sm font-semibold ${
                !selectedCategoryId ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {totalQuestionsCount}
            </span>
          </div>
        </button>

        {/* Category List */}
        {categories.map((category) => (
          <div
            key={category.category_id}
            className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
              selectedCategoryId === category.category_id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <button
              className="flex-1 text-left"
              onClick={() => handleSelectCategory(category.category_id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <span
                  className={`text-sm font-semibold ml-2 ${
                    selectedCategoryId === category.category_id
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {category.question_count || 0}
                </span>
              </div>
              {category.description && (
                <p className="text-xs opacity-70 mt-1">{category.description}</p>
              )}
            </button>
            <div className="flex items-center gap-1 ml-2">
              {canUpdateCategory && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => handleOpenDialog(category)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
              {canDeleteCategory && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(category)}
                  disabled={(category.question_count || 0) > 0}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('category.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('category.deleteConfirmDescription', { name: categoryToDelete?.name })}
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
                className="bg-destructive hover:bg-destructive/90 text-white"
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
