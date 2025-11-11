import { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
      toast.success('Preview loaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to preview file')
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
        toast.success(`Successfully imported ${data.imported} questions`)
        queryClient.invalidateQueries({ queryKey: ['questions'] })
        queryClient.invalidateQueries({ queryKey: ['categories'] })
      } else {
        toast.warning(`Imported ${data.imported} questions with ${data.failed} errors`)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to import file')
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
        toast.error('Please select a valid Excel file (.xlsx or .xls)')
        return
      }

      // Validate file size (max 10MB)
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB')
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
    toast.success('Template downloaded')
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
    const options = [row.A, row.B, row.C, row.D, row.E, row.F, row.G, row.H, row.I, row.J]
      .filter(Boolean)
      .join(', ')

    return (
      <TableRow key={index}>
        <TableCell className="font-medium">{index + 1}</TableCell>
        <TableCell className="whitespace-normal">{row.content}</TableCell>
        <TableCell>{getTypeBadge(row.type)}</TableCell>
        <TableCell className="whitespace-normal">{row.category_name || '-'}</TableCell>
        <TableCell>{getDifficultyBadge(row.difficulty)}</TableCell>
        <TableCell className="text-sm whitespace-normal">{options || '-'}</TableCell>
        <TableCell className="whitespace-normal">{row.correct_answers || '-'}</TableCell>
      </TableRow>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-hidden flex flex-col" ref={dialogContentRef}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Questions from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file to import multiple questions at once
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="preview" disabled={!preview}>Preview</TabsTrigger>
            <TabsTrigger value="result" disabled={!importResult}>Result</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Download the template, fill it with your questions, then upload it here
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
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
                    <Label htmlFor="preview-limit">Preview rows:</Label>
                    <Select
                      value={previewLimit.toString()}
                      onValueChange={(v) => setPreviewLimit(Number(v))}
                    >
                      <SelectTrigger id="preview-limit" className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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
                      Change File
                    </Button>
                    <Button
                      onClick={handlePreview}
                      disabled={previewMutation.isPending}
                      className="gap-2"
                    >
                      {previewMutation.isPending ? 'Loading...' : 'Preview'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">
                      Excel files only (.xlsx, .xls)
                    </p>
                  </div>
                  <Button onClick={() => document.getElementById('excel-file')?.click()}>
                    Select File
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
                      ? `Showing all ${preview.total} rows`
                      : `Showing ${preview.preview.length} of ${preview.total} total rows`
                    }
                  </AlertDescription>
                </Alert>

                <div className="flex-1 overflow-auto border rounded-md">
                  <Table className="relative">
                    <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                      <TableRow>
                        <TableHead className="w-12 whitespace-nowrap border-r">#</TableHead>
                        <TableHead className="min-w-[300px] whitespace-nowrap border-r">Content</TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap border-r">Type</TableHead>
                        <TableHead className="min-w-[150px] whitespace-nowrap border-r">Category</TableHead>
                        <TableHead className="min-w-[120px] whitespace-nowrap border-r">Difficulty</TableHead>
                        <TableHead className="min-w-[400px] whitespace-nowrap border-r">Options</TableHead>
                        <TableHead className="min-w-[100px] whitespace-nowrap">Correct</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.preview.map((row, index) => renderPreviewRow(row, index))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('upload')}>
                    Back
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={importMutation.isPending}
                    className="gap-2"
                  >
                    {importMutation.isPending ? 'Importing...' : 'Import All'}
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
                      <div className="font-medium">Imported</div>
                      <div className="text-2xl font-bold">{importResult.imported}</div>
                    </AlertDescription>
                  </Alert>

                  <Alert variant={importResult.failed > 0 ? 'destructive' : 'default'}>
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium">Failed</div>
                      <div className="text-2xl font-bold">{importResult.failed}</div>
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium">Total</div>
                      <div className="text-2xl font-bold">{importResult.total}</div>
                    </AlertDescription>
                  </Alert>
                </div>

                {importResult.errors.length > 0 && (
                  <>
                    <h4 className="font-medium">Errors:</h4>
                    <div className="flex-1 overflow-auto rounded-md border">
                      <div className="p-4 space-y-3">
                        {importResult.errors.map((error, index) => (
                          <Alert key={index} variant="destructive">
                            <AlertDescription>
                              <div className="font-medium mb-1">
                                Row {error.row}: {error.content}
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
                  <Button onClick={handleClose}>Close</Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
