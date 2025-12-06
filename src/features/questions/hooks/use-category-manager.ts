import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRecoilValue } from 'recoil'
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from './use-questions'
import { userPermissionsSelector, currentUserState } from '@/global/recoil/user'
import { categorySchema, type CategoryFormValues } from '../schemas/question-schema'
import type { QuestionCategory } from '@/types/question'

export interface UseCategoryManagerProps {
  onCategoriesChange: () => void
  selectedCategoryId?: number
  onSelectCategory: (categoryId?: number) => void
}

export function useCategoryManager({
  onCategoriesChange,
  selectedCategoryId,
  onSelectCategory,
}: UseCategoryManagerProps) {
  // ============================================
  // STATE
  // ============================================
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<QuestionCategory | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<QuestionCategory | null>(null)

  // ============================================
  // RECOIL STATE
  // ============================================
  const currentUser = useRecoilValue(currentUserState)
  const userPermissions = useRecoilValue(userPermissionsSelector)

  // ============================================
  // PERMISSIONS
  // ============================================
  const canCreateCategory = userPermissions.some(
    (p) => p.resource === 'question-categories' && p.action === 'create'
  )
  const canUpdateCategory = userPermissions.some(
    (p) => p.resource === 'question-categories' && p.action === 'update'
  )
  const canDeleteCategory = userPermissions.some(
    (p) => p.resource === 'question-categories' && p.action === 'delete'
  )

  // ============================================
  // MUTATIONS
  // ============================================
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  // ============================================
  // FORM
  // ============================================
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleOpenDialog = useCallback(
    (category?: QuestionCategory) => {
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
    },
    [form]
  )

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
  }, [])

  const handleSubmit = useCallback(
    async (values: CategoryFormValues) => {
      try {
        if (editingCategory) {
          await updateMutation.mutateAsync({
            id: editingCategory.category_id,
            data: values,
          })
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
    },
    [editingCategory, currentUser, updateMutation, createMutation, onCategoriesChange]
  )

  const handleDelete = useCallback((category: QuestionCategory) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
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
  }, [categoryToDelete, deleteMutation, selectedCategoryId, onSelectCategory, onCategoriesChange])

  const cancelDelete = useCallback(() => {
    setCategoryToDelete(null)
  }, [])

  const handleSelectAll = useCallback(() => {
    onSelectCategory(undefined)
  }, [onSelectCategory])

  const handleSelectCategory = useCallback(
    (categoryId: number) => {
      onSelectCategory(categoryId)
    },
    [onSelectCategory]
  )

  // ============================================
  // RETURN
  // ============================================
  return {
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
  }
}
