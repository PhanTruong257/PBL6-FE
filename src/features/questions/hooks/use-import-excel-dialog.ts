import { useState, useRef, useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/libs/toast'
import { useQuestionsTranslation } from './use-questions-translation'
import { questionsApi } from '../apis/questions-service'
import type { PreviewExcelResult, ImportQuestionResult, ExcelQuestionRow } from '@/types/question'

export interface UseImportExcelDialogProps {
  onOpenChange: (open: boolean) => void
}

export function useImportExcelDialog({ onOpenChange }: UseImportExcelDialogProps) {
  const { t } = useQuestionsTranslation()
  const queryClient = useQueryClient()

  // ============================================
  // STATE
  // ============================================
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<PreviewExcelResult | null>(null)
  const [importResult, setImportResult] = useState<ImportQuestionResult | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'result'>('upload')
  const [previewLimit, setPreviewLimit] = useState<number>(10)

  // ============================================
  // REFS
  // ============================================
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ============================================
  // CLEANUP EFFECT
  // ============================================
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // ============================================
  // HELPER: Scroll to top with cleanup
  // ============================================
  const scrollToTop = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      dialogContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }, [])

  // ============================================
  // MUTATIONS
  // ============================================
  const previewMutation = useMutation({
    mutationFn: ({ fileToPreview, limit }: { fileToPreview: File; limit: number }) =>
      questionsApi.previewImport(fileToPreview, limit),
    onSuccess: (response) => {
      setPreview(response.data)
      setActiveTab('preview')
      scrollToTop()
      toast.success(t('import.toastPreviewSuccess'))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('import.toastPreviewError'))
    },
  })

  const importMutation = useMutation({
    mutationFn: (fileToImport: File) => questionsApi.importExcel(fileToImport),
    onSuccess: (response) => {
      const data = response.data
      setImportResult(data)
      setActiveTab('result')
      scrollToTop()

      if (data.success) {
        toast.success(t('import.toastImportSuccess', { count: data.imported }))
        queryClient.invalidateQueries({ queryKey: ['questions'] })
        queryClient.invalidateQueries({ queryKey: ['question-categories'] })
      } else {
        toast.warning(`Imported ${data.imported} questions with ${data.failed} errors`)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('import.toastImportError'))
    },
  })

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = e.target.files?.[0]
      if (uploadedFile) {
        // Validate file type
        const validTypes = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ]

        if (!validTypes.includes(uploadedFile.type)) {
          toast.error(t('import.toastInvalidFile'))
          return
        }

        // Validate file size (max 10MB)
        if (uploadedFile.size > 10 * 1024 * 1024) {
          toast.error(t('import.toastFileTooLarge'))
          return
        }

        setSelectedFile(uploadedFile)
        setPreview(null)
        setImportResult(null)
        setActiveTab('upload')
      }
    },
    [t]
  )

  const handlePreview = useCallback(() => {
    if (selectedFile) {
      previewMutation.mutate({ fileToPreview: selectedFile, limit: previewLimit })
    }
  }, [selectedFile, previewLimit, previewMutation])

  const handleImport = useCallback(() => {
    if (selectedFile) {
      importMutation.mutate(selectedFile)
    }
  }, [selectedFile, importMutation])

  const handleDownloadTemplate = useCallback(() => {
    questionsApi.downloadTemplate()
    toast.success(t('import.toastTemplateDownloaded'))
  }, [t])

  const handleClose = useCallback(() => {
    setSelectedFile(null)
    setPreview(null)
    setImportResult(null)
    setActiveTab('upload')
    setPreviewLimit(10)
    onOpenChange(false)
  }, [onOpenChange])

  const handlePreviewLimitChange = useCallback((value: string) => {
    setPreviewLimit(Number(value))
  }, [])

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'upload' | 'preview' | 'result')
  }, [])

  const triggerFileInput = useCallback(() => {
    document.getElementById('excel-file')?.click()
  }, [])

  const goBackToUpload = useCallback(() => {
    setActiveTab('upload')
  }, [])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const getDifficultyBadgeVariant = useCallback(
    (difficulty?: string): 'default' | 'secondary' | 'destructive' | undefined => {
      if (!difficulty) return undefined

      const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
        easy: 'default',
        medium: 'secondary',
        hard: 'destructive',
      }

      return variants[difficulty]
    },
    []
  )

  const getTypeBadgeVariant = useCallback(
    (type: string): 'default' | 'secondary' => {
      return type === 'multiple_choice' ? 'default' : 'secondary'
    },
    []
  )

  const getTypeLabel = useCallback((type: string): string => {
    return type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'
  }, [])

  const parseOptionsFromRow = useCallback((row: ExcelQuestionRow) => {
    return [
      { text: row.F, correct: row.G, label: 'A' },
      { text: row.H, correct: row.I, label: 'B' },
      { text: row.J, correct: row.K, label: 'C' },
      { text: row.L, correct: row.M, label: 'D' },
      { text: row.N, correct: row.O, label: 'E' },
      { text: row.P, correct: row.Q, label: 'F' },
      { text: row.R, correct: row.S, label: 'G' },
      { text: row.T, correct: row.U, label: 'H' },
    ].filter((opt) => opt.text && opt.text.trim() !== '')
  }, [])

  const isOptionCorrect = useCallback((correct?: string): boolean => {
    return correct === 'true' || correct === 'TRUE' || correct === '1'
  }, [])

  const getCorrectAnswersFromRow = useCallback(
    (row: ExcelQuestionRow): string => {
      const options = parseOptionsFromRow(row)
      return options
        .filter((opt) => isOptionCorrect(opt.correct))
        .map((opt) => opt.label)
        .join(', ')
    },
    [parseOptionsFromRow, isOptionCorrect]
  )

  const hasRowError = useCallback((row: ExcelQuestionRow): boolean => {
    return !!(row.status && row.status.trim() !== '')
  }, [])

  // ============================================
  // RETURN
  // ============================================
  return {
    // State
    selectedFile,
    preview,
    importResult,
    activeTab,
    previewLimit,

    // Refs
    dialogContentRef,

    // Mutations state
    isPreviewPending: previewMutation.isPending,
    isImportPending: importMutation.isPending,

    // Handlers
    handleFileChange,
    handlePreview,
    handleImport,
    handleDownloadTemplate,
    handleClose,
    handlePreviewLimitChange,
    handleTabChange,
    triggerFileInput,
    goBackToUpload,

    // Helpers
    getDifficultyBadgeVariant,
    getTypeBadgeVariant,
    getTypeLabel,
    parseOptionsFromRow,
    isOptionCorrect,
    getCorrectAnswersFromRow,
    hasRowError,
  }
}
