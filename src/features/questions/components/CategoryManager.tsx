import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRecoilValue } from 'recoil'
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
import { categorySchema, type CategoryFormValues } from '../schemas/question-schema'
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks'
import { userPermissionsSelector, currentUserState } from '@/global/recoil/user'
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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<QuestionCategory | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<QuestionCategory | null>(null)

  // Get current user and permissions from recoil
  const currentUser = useRecoilValue(currentUserState)
  const userPermissions = useRecoilValue(userPermissionsSelector)

  // Check permissions
  const canCreateCategory = userPermissions.some(
    p => p.resource === 'question-categories' && p.action === 'create'
  )
  const canUpdateCategory = userPermissions.some(
    p => p.resource === 'question-categories' && p.action === 'update'
  )
  const canDeleteCategory = userPermissions.some(
    p => p.resource === 'question-categories' && p.action === 'delete'
  )

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const handleOpenDialog = (category?: QuestionCategory) => {
    if (category) {
      setEditingCategory(category)
      form.reset({
        name: category.name,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      form.reset({
        name: '',
        description: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.category_id, data: values })
      } else {
        // Add created_by from current user
        if (!currentUser?.user_id) {
          console.error('User not authenticated')
          return
        }
        await createMutation.mutateAsync({
          ...values,
          created_by: currentUser.user_id,
        })
      }
      setIsDialogOpen(false)
      onCategoriesChange()
    } catch (error) {
      // Error handled by hook
    }
  }

  const handleDelete = (category: QuestionCategory) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      await deleteMutation.mutateAsync(categoryToDelete.category_id)
      if (selectedCategoryId === categoryToDelete.category_id) {
        onSelectCategory(undefined)
      }
      onCategoriesChange()
    } catch (error) {
      // Error handled by hook
    } finally {
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Categories
        </h3>
        {canCreateCategory && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mathematics" {...field} />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Optional description..."
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      <div className="space-y-2">
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            !selectedCategoryId
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
          onClick={() => onSelectCategory(undefined)}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">All Questions</span>
            <span className={`text-sm font-semibold ${
              !selectedCategoryId ? 'text-primary-foreground' : 'text-muted-foreground'
            }`}>
              {categories.reduce((sum, cat) => sum + (cat.question_count || 0), 0)}
            </span>
          </div>
        </button>

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
              onClick={() => onSelectCategory(category.category_id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <span className={`text-sm font-semibold ml-2 ${
                  selectedCategoryId === category.category_id 
                    ? 'text-primary-foreground' 
                    : 'text-muted-foreground'
                }`}>
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={confirmDelete} 
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
