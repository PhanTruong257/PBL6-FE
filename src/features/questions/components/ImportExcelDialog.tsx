import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/libs/toast'
import { useQuestionsTranslation } from '../hooks'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { questionsApi } from '../apis/questions-service'
import type { PreviewExcelResult, ImportQuestionResult, ExcelQuestionRow } from '@/types/question'

interface ImportExcelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportExcelDialog({ open, onOpenChange }: ImportExcelDialogProps) {
  const { t } = useQuestionsTranslation()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<PreviewExcelResult | null>(null)
  const [importResult, setImportResult] = useState<ImportQuestionResult | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'result'>('upload')
  const [previewLimit, setPreviewLimit] = useState<number>(10)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  
  const queryClient = useQueryClient()

  // Preview mutation
  const previewMutation = useMutation({
    mutationFn: ({ fileToPreview, limit }: { fileToPreview: File; limit: number }) => 
      questionsApi.previewImport(fileToPreview, limit),
    onSuccess: (data) => {
      setPreview(data)
      setActiveTab('preview')
      // Scroll to top of dialog
      setTimeout(() => {
        dialogContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      toast.success(t('import.toastPreviewSuccess'))
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('import.toastPreviewError'))
    },
  })

  // Import mutation
  const importMutation = useMutation({
    mutationFn: (fileToImport: File) => questionsApi.importExcel(fileToImport),
    onSuccess: (data) => {
      setImportResult(data)
      setActiveTab('result')
      // Scroll to top of dialog
      setTimeout(() => {
        dialogContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      
      if (data.success) {
        toast.success(t('import.toastImportSuccess', { count: data.imported }))
        queryClient.invalidateQueries({ queryKey: ['questions'] })
        queryClient.invalidateQueries({ queryKey: ['categories'] })
      } else {
        toast.warning(`Imported ${data.imported} questions with ${data.failed} errors`)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('import.toastImportError'))
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }

  const handlePreview = () => {
    if (selectedFile) {
      previewMutation.mutate({ fileToPreview: selectedFile, limit: previewLimit })
    }
  }

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile)
    }
  }

  const handleDownloadTemplate = () => {
    questionsApi.downloadTemplate()
    toast.success(t('import.toastTemplateDownloaded'))
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreview(null)
    setImportResult(null)
    setActiveTab('upload')
    setPreviewLimit(10)
    onOpenChange(false)
  }

  const getDifficultyBadge = (difficulty?: string) => {
    if (!difficulty) return null
    
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      easy: 'default',
      medium: 'secondary',
      hard: 'destructive',
    }
    
    return <Badge variant={variants[difficulty]}>{difficulty}</Badge>
  }

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'multiple_choice' ? 'default' : 'secondary'}>
        {type === 'multiple_choice' ? 'Multiple Choice' : 'Essay'}
      </Badge>
    )
  }

  const renderPreviewRow = (row: ExcelQuestionRow, index: number) => {
    // Parse options from 8 pairs (F-G, H-I, J-K, L-M, N-O, P-Q, R-S, T-U)
    const optionsData = [
      { text: row.F, correct: row.G, label: 'A' },
      { text: row.H, correct: row.I, label: 'B' },
      { text: row.J, correct: row.K, label: 'C' },
      { text: row.L, correct: row.M, label: 'D' },
      { text: row.N, correct: row.O, label: 'E' },
      { text: row.P, correct: row.Q, label: 'F' },
      { text: row.R, correct: row.S, label: 'G' },
      { text: row.T, correct: row.U, label: 'H' },
    ].filter((opt) => opt.text && opt.text.trim() !== '')

    const optionsDisplay = optionsData.map((opt) => {
      const isCorrect = opt.correct === 'true' || opt.correct === 'TRUE' || opt.correct === '1'
      return (
        <div key={opt.label} className={`inline-block px-2 py-1 rounded mr-2 mb-1 ${isCorrect ? 'bg-green-100 text-green-800 font-semibold' : 'bg-gray-100'}`}>
          {opt.label}: {opt.text}
        </div>
      )
    })

    const correctAnswers = optionsData
      .filter((opt) => opt.correct === 'true' || opt.correct === 'TRUE' || opt.correct === '1')
      .map((opt) => opt.label)
      .join(', ')

    // Check if row has errors (from status field)
    const hasError = row.status && row.status.trim() !== ''

    return (
      <TableRow key={index} className={hasError ? 'bg-red-50 hover:bg-red-100' : ''}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell className="whitespace-normal max-w-[300px]">{row.content}</TableCell>
        <TableCell>{getTypeBadge(row.type)}</TableCell>
        <TableCell className="whitespace-normal">{row.category_name || '-'}</TableCell>
        <TableCell>{getDifficultyBadge(row.difficulty)}</TableCell>
        <TableCell className="text-sm whitespace-normal max-w-[400px]">
          <div className="flex flex-wrap">{optionsDisplay}</div>
        </TableCell>
        <TableCell className="whitespace-normal">
          {correctAnswers || '-'}
        </TableCell>
        {hasError && (
          <TableCell className="text-red-600 text-sm whitespace-normal max-w-[250px]">
            {row.status}
          </TableCell>
        )}
      </TableRow>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-hidden flex flex-col" ref={dialogContentRef}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {t('import.title')}
          </DialogTitle>
          <DialogDescription>
            {t('import.description')}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">{t('import.upload')}</TabsTrigger>
            <TabsTrigger value="preview" disabled={!preview}>{t('import.preview')}</TabsTrigger>
            <TabsTrigger value="result" disabled={!importResult}>{t('import.result')}</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('import.alertTemplate')}
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t('import.downloadTemplate')}
              </Button>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                id="excel-file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <FileSpreadsheet className="h-16 w-16 mx-auto text-green-500" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  
                  {/* Preview limit control */}
                  <div className="flex items-center justify-center gap-2">
                    <Label htmlFor="preview-limit">{t('import.previewRows')}</Label>
                    <Select
                      value={previewLimit.toString()}
                      onValueChange={(v) => setPreviewLimit(Number(v))}
                    >
                      <SelectTrigger id="preview-limit" className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => document.getElementById('excel-file')?.click()}
                      variant="outline"
                    >
                      {t('import.changeFile')}
                    </Button>
                    <Button
                      onClick={handlePreview}
                      disabled={previewMutation.isPending}
                      className="gap-2"
                    >
                      {previewMutation.isPending ? t('import.loading') : t('import.preview')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('import.dragDrop')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('import.excelFilesOnly')}
                    </p>
                  </div>
                  <Button onClick={() => document.getElementById('excel-file')?.click()}>
                    {t('import.selectFile')}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {preview && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {preview.preview.length === preview.total 
                      ? t('import.alertPreviewAll', { total: preview.total })
                      : t('import.alertPreviewPartial', { shown: preview.preview.length, total: preview.total })
                    }
                  </AlertDescription>
                </Alert>

                <div className="flex-1 border rounded-md max-h-[55vh] overflow-auto">
                  <Table className="relative min-w-full">
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="w-12 whitespace-nowrap border-r">#</TableHead>
                        <TableHead className="min-w-[300px] whitespace-nowrap border-r">{t('import.tableContent')}</TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap border-r">{t('import.tableType')}</TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap border-r">{t('import.tableCategory')}</TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap border-r">{t('import.tableDifficulty')}</TableHead>
                        <TableHead className="min-w-[400px] whitespace-nowrap border-r">{t('import.tableOptions')}</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap border-r">{t('import.tableCorrect')}</TableHead>
                        <TableHead className="min-w-[250px] whitespace-nowrap">{t('import.tableStatus')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.preview.slice(0, previewLimit).map((row, index) =>
                        renderPreviewRow(row, index)
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('upload')}>
                    {t('import.back')}
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={importMutation.isPending}
                    className="gap-2"
                  >
                    {importMutation.isPending ? t('import.importing') : t('import.importAll')}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Result Tab */}
          <TabsContent value="result" className="space-y-4 flex-1 overflow-hidden flex flex-col">
            {importResult && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription>
                      <div className="font-medium">{t('import.resultImported')}</div>
                      <div className="text-2xl font-bold">{importResult.imported}</div>
                    </AlertDescription>
                  </Alert>

                  <Alert variant={importResult.failed > 0 ? 'destructive' : 'default'}>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium">{t('import.resultFailed')}</div>
                      <div className="text-2xl font-bold">{importResult.failed}</div>
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium">{t('import.resultTotal')}</div>
                      <div className="text-2xl font-bold">{importResult.total}</div>
                    </AlertDescription>
                  </Alert>
                </div>

                {importResult.errors.length > 0 && (
                  <>
                    <h4 className="font-medium">{t('import.resultErrors')}</h4>
                    <div className="flex-1 overflow-auto rounded-md border">
                      <div className="p-4 space-y-3">
                        {importResult.errors.map((error, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertDescription>
                              <div className="font-medium mb-1">
                                {t('import.resultRow')} {error.row}: {error.content}
                              </div>
                              <ul className="list-disc list-inside text-sm">
                                {error.errors.map((err, i) => (
                                  <li key={i}>{err}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-2 border-t">
                  <Button onClick={handleClose}>{t('import.close')}</Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
