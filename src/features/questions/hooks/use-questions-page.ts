import { useState, useEffect, useCallback, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '@/libs'
import { userPermissionsSelector, currentUserState } from '@/global/recoil/user'
import { userRoleSelector } from '@/global/recoil/user/userSelector'
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
import type { Question, QuestionFilterParams } from '@/types/question'
import type { QuestionFormValues, SearchFormValues } from '../schemas/question-schema'

export const ITEMS_PER_PAGE = 10

export function useQuestionsPage() {
  const navigate = useNavigate()
  const { t } = useQuestionsTranslation()

  // ============================================
  // LOCAL STATE
  // ============================================
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
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

  // Ref for timeout cleanup
  const accessCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ============================================
  // RECOIL STATE
  // ============================================
  const currentUser = useRecoilValue(currentUserState)
  const userPermissions = useRecoilValue(userPermissionsSelector)
  const userRole = useRecoilValue(userRoleSelector)

  // ============================================
  // API HOOKS
  // ============================================
  const { data: categoriesData } = useCategories()
  const categories = categoriesData || []

  const questionsParams: QuestionFilterParams = {
    ...filters,
    category_ids: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  }
  const { data: questionsData, isLoading } = useQuestions(questionsParams)
  const { data: viewingQuestion } = useQuestion(viewingQuestionId || 0)

  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()
  const deleteMutation = useDeleteQuestion()

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    accessCheckTimeoutRef.current = setTimeout(() => {
      setIsCheckingAccess(false)
    }, 500)

    return () => {
      if (accessCheckTimeoutRef.current) {
        clearTimeout(accessCheckTimeoutRef.current)
      }
    }
  }, [])

  // ============================================
  // DERIVED STATE
  // ============================================
  const hasAccess = userRole === 'admin' || userRole === 'teacher'
  const canCreateQuestion = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'create'
  )
  const canExportExcel = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'view'
  )
  const canExportText = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'view'
  )
  const canExportDocx = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'view'
  )
  const canImport = userPermissions.some(
    (p) => p.resource === 'questions' && p.action === 'create'
  )
  const questions = questionsData?.data || []
  const totalPages = questionsData?.meta.totalPages || 1
  const totalQuestions = questionsData?.meta.total || 0

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleSearch = useCallback((values: SearchFormValues) => {
    setFilters({
      ...values,
      category_id: values.category_id ?? undefined,
    })
    setCurrentPage(1)
  }, [])

  const handleOpenForm = useCallback((question?: Question) => {
    setEditingQuestion(question || null)
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setEditingQuestion(null)
    setIsFormOpen(false)
  }, [])

  const handleSubmitForm = useCallback(
    async (values: QuestionFormValues) => {
      try {
        // Validate user authentication
        if (!currentUser?.user_id) {
          toast.error('Bạn cần đăng nhập để thực hiện thao tác này')
          return
        }

        const submitData = {
          ...values,
          category_id: values.category_id ?? undefined,
          created_by: currentUser.user_id,
        }

        if (editingQuestion) {
          await updateMutation.mutateAsync({
            id: editingQuestion.question_id,
            data: submitData,
          })
        } else {
          await createMutation.mutateAsync(submitData)
        }
        handleCloseForm()
      } catch (error) {
        // Error handled by mutation hooks
      }
    },
    [currentUser, editingQuestion, updateMutation, createMutation, handleCloseForm]
  )

  const handleDeleteQuestion = useCallback((question: Question) => {
    setQuestionToDelete(question)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!questionToDelete) return

    try {
      await deleteMutation.mutateAsync(questionToDelete.question_id)
    } catch (error) {
      // Error handled by mutation hook
    } finally {
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    }
  }, [questionToDelete, deleteMutation])

  const handleViewQuestion = useCallback((question: Question) => {
    setViewingQuestionId(question.question_id)
  }, [])

  const closeViewDialog = useCallback(() => {
    setViewingQuestionId(null)
  }, [])

  const handleExport = useCallback(
    async (format: 'excel' | 'text' | 'docx') => {
      try {
        const exportParams = {
          ...filters,
          category_ids: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
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
    },
    [filters, selectedCategoryIds, t]
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const navigateToDashboard = useCallback(() => {
    navigate({ to: '/dashboard' })
  }, [navigate])

  const openImportDialog = useCallback(() => {
    setIsImportDialogOpen(true)
  }, [])

  const closeImportDialog = useCallback((open: boolean) => {
    setIsImportDialogOpen(open)
  }, [])

  const cancelDelete = useCallback(() => {
    setQuestionToDelete(null)
  }, [])

  // ============================================
  // RETURN
  // ============================================
  return {

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
    questionsData,
    viewingQuestion,
    totalPages,
    totalQuestions,
    isLoading,
    limit: ITEMS_PER_PAGE,

    // Permissions
    hasAccess,
    canCreateQuestion,
    canExportExcel,
    canExportText,
    canExportDocx,
    canImport,

    // Mutations state
    isSubmitting: createMutation.isPending || updateMutation.isPending,

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
  }
}
