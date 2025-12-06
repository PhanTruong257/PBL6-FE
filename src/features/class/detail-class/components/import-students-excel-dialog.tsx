import { useState, useRef } from 'react'
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/libs/toast'
import * as XLSX from 'xlsx'

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

import { ClassService } from '@/features/class/api/class-service'
import type { ClassBasicInfo } from '@/types/class'

interface ImportStudentsExcelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classInfo: ClassBasicInfo
  onImportSuccess?: (count: number) => void
}

interface StudentRow {
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  isValid: boolean
  error?: string
}

interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: string[]
}

export function ImportStudentsExcelDialog({
  open,
  onOpenChange,
  classInfo,
  onImportSuccess,
}: ImportStudentsExcelDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedStudents, setParsedStudents] = useState<StudentRow[]>([])
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'result'>(
    'upload',
  )
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (students: StudentRow[]) => {
      // Filter valid students only
      const validStudents = students.filter((s) => s.isValid)

      if (validStudents.length === 0) {
        throw new Error('Không có sinh viên hợp lệ để import')
      }

      // Get user profiles by emails
      const emails = validStudents.map((s) => s.email)
      const users = await ClassService.getUsersByEmails(emails)

      if (users.length === 0) {
        throw new Error(
          'Không tìm thấy người dùng nào trong hệ thống với các email đã cung cấp',
        )
      }

      // Map users to required format for API
      const studentsToAdd = users.map((user: any) => {
        const nameParts = (user.full_name || '').trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''

        return {
          id: user.user_id,
          email: user.email,
          firstName: firstName,
          lastName: lastName,
        }
      })

      // Add students to class
      await ClassService.addMembers({
        classId: classInfo.class_id,
        students: studentsToAdd,
      })

      return {
        success: true,
        imported: studentsToAdd.length,
        failed: validStudents.length - users.length,
        errors:
          validStudents.length > users.length
            ? [
                `${validStudents.length - users.length} email không tìm thấy trong hệ thống`,
              ]
            : [],
      }
    },
    onSuccess: (data) => {
      setImportResult(data)
      setActiveTab('result')
      setTimeout(() => {
        dialogContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)

      if (data.success && data.failed === 0) {
        toast.success(`Đã thêm ${data.imported} sinh viên thành công!`)
      } else if (data.imported > 0) {
        toast.warning(`Đã thêm ${data.imported} sinh viên, ${data.failed} lỗi`)
      }

      // Call callback to update parent component state immediately
      if (onImportSuccess && data.imported > 0) {
        onImportSuccess(data.imported)
      }

      // Invalidate all class-related queries to refresh student list, count, and detail
      queryClient.invalidateQueries({ queryKey: ['class-students'] })
      queryClient.invalidateQueries({ queryKey: ['class-students-count'] })
      queryClient.invalidateQueries({ queryKey: ['class-detail'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi import sinh viên')
    },
  })

  const parseExcelFile = async (file: File) => {
    setIsParsing(true)
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      // Get first sheet
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 })

      // Find header row (look for 'email' column)
      let headerRowIndex = 0
      let emailColIndex = -1

      for (let i = 0; i < Math.min(10, jsonData.length); i++) {
        const row = jsonData[i] as any[]
        if (row) {
          const emailIdx = row.findIndex(
            (cell) =>
              typeof cell === 'string' && cell.toLowerCase().includes('email'),
          )
          if (emailIdx !== -1) {
            headerRowIndex = i
            emailColIndex = emailIdx
            break
          }
        }
      }

      // If no header found, assume first column is email
      if (emailColIndex === -1) {
        emailColIndex = 0
        headerRowIndex = 0
      }

      // Parse students from rows after header
      const students: StudentRow[] = []
      const headers = jsonData[headerRowIndex] as any[]

      // Find other column indices
      let firstNameColIndex = headers?.findIndex(
        (h) =>
          typeof h === 'string' &&
          (h.toLowerCase().includes('firstname') ||
            h.toLowerCase().includes('first_name') ||
            h.toLowerCase() === 'họ'),
      )
      let lastNameColIndex = headers?.findIndex(
        (h) =>
          typeof h === 'string' &&
          (h.toLowerCase().includes('lastname') ||
            h.toLowerCase().includes('last_name') ||
            h.toLowerCase() === 'tên'),
      )
      let fullNameColIndex = headers?.findIndex(
        (h) =>
          typeof h === 'string' &&
          (h.toLowerCase().includes('fullname') ||
            h.toLowerCase().includes('full_name') ||
            h.toLowerCase().includes('họ và tên') ||
            h.toLowerCase() === 'name' ||
            h.toLowerCase() === 'tên đầy đủ'),
      )

      for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[]
        if (!row || row.length === 0) continue

        const email = row[emailColIndex]?.toString().trim()

        if (!email) continue

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isValidEmail = emailRegex.test(email)

        const student: StudentRow = {
          email,
          firstName:
            firstNameColIndex !== -1
              ? row[firstNameColIndex]?.toString().trim()
              : undefined,
          lastName:
            lastNameColIndex !== -1
              ? row[lastNameColIndex]?.toString().trim()
              : undefined,
          fullName:
            fullNameColIndex !== -1
              ? row[fullNameColIndex]?.toString().trim()
              : undefined,
          isValid: isValidEmail,
          error: isValidEmail ? undefined : 'Email không hợp lệ',
        }

        students.push(student)
      }

      setParsedStudents(students)
      setActiveTab('preview')
      toast.success(`Đã đọc ${students.length} sinh viên từ file`)
    } catch (error) {
      console.error('Error parsing Excel:', error)
      toast.error('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
      ]

      if (
        !validTypes.includes(uploadedFile.type) &&
        !uploadedFile.name.endsWith('.xlsx') &&
        !uploadedFile.name.endsWith('.xls')
      ) {
        toast.error('Vui lòng chọn file Excel (.xlsx hoặc .xls)')
        return
      }

      // Validate file size (max 5MB)
      if (uploadedFile.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file phải nhỏ hơn 5MB')
        return
      }

      setSelectedFile(uploadedFile)
      setParsedStudents([])
      setImportResult(null)
      setActiveTab('upload')

      // Auto parse the file
      parseExcelFile(uploadedFile)
    }
  }

  const handleImport = () => {
    if (parsedStudents.length > 0) {
      importMutation.mutate(parsedStudents)
    }
  }

  const handleDownloadTemplate = () => {
    // Create template workbook
    const templateData = [
      ['Email', 'Họ và tên'],
      ['student1@example.com', 'Nguyễn Văn A'],
      ['student2@example.com', 'Trần Thị B'],
    ]

    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')

    // Download file
    XLSX.writeFile(wb, 'import_students_template.xlsx')
    toast.success('Đã tải template')
  }

  const handleClose = () => {
    setSelectedFile(null)
    setParsedStudents([])
    setImportResult(null)
    setActiveTab('upload')
    onOpenChange(false)
  }

  const validCount = parsedStudents.filter((s) => s.isValid).length
  const invalidCount = parsedStudents.filter((s) => !s.isValid).length

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        ref={dialogContentRef}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import sinh viên từ Excel
          </DialogTitle>
          <DialogDescription>
            Tải lên file Excel chứa danh sách email sinh viên để thêm vào lớp{' '}
            <strong>{classInfo.class_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className="w-full flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Tải lên</TabsTrigger>
            <TabsTrigger value="preview" disabled={parsedStudents.length === 0}>
              Xem trước ({parsedStudents.length})
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!importResult}>
              Kết quả
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              {/* Download template button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải template
                </Button>
              </div>

              {/* File upload area */}
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {isParsing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Đang đọc file...
                    </p>
                  </div>
                ) : selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="h-12 w-12 text-green-500" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <p className="font-medium">
                      Click để chọn file hoặc kéo thả vào đây
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hỗ trợ file .xlsx, .xls (tối đa 5MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Hướng dẫn:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>
                      File Excel cần có cột <strong>Email</strong> chứa địa chỉ
                      email của sinh viên
                    </li>
                    <li>
                      Email phải trùng với email đã đăng ký trong hệ thống
                    </li>
                    <li>
                      Có thể thêm các cột: Họ và tên, Họ, Tên (không bắt buộc)
                    </li>
                    <li>Tải template mẫu để xem định dạng chuẩn</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              {/* Summary */}
              <div className="flex items-center gap-4">
                <Badge variant="default" className="text-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Hợp lệ: {validCount}
                </Badge>
                {invalidCount > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    <XCircle className="h-3 w-3 mr-1" />
                    Lỗi: {invalidCount}
                  </Badge>
                )}
              </div>

              {/* Students table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead className="w-24">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedStudents.map((student, index) => (
                      <TableRow
                        key={index}
                        className={!student.isValid ? 'bg-red-50' : ''}
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          {student.fullName ||
                            [student.firstName, student.lastName]
                              .filter(Boolean)
                              .join(' ') ||
                            '-'}
                        </TableCell>
                        <TableCell>
                          {student.isValid ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              OK
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Lỗi
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Import button */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('upload')}
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={validCount === 0 || importMutation.isPending}
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang import...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {validCount} sinh viên
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Result Tab */}
          <TabsContent value="result" className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              {importResult && (
                <>
                  {importResult.success && importResult.failed === 0 ? (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-green-700">
                        <strong>Thành công!</strong> Đã thêm{' '}
                        {importResult.imported} sinh viên vào lớp.
                      </AlertDescription>
                    </Alert>
                  ) : importResult.imported > 0 ? (
                    <Alert className="border-yellow-500 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <AlertDescription className="text-yellow-700">
                        <strong>Hoàn thành với cảnh báo!</strong>
                        <br />
                        Đã thêm: {importResult.imported} sinh viên
                        <br />
                        Lỗi: {importResult.failed}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Thất bại!</strong> Không thể thêm sinh viên nào.
                      </AlertDescription>
                    </Alert>
                  )}

                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-700 mb-2">
                        Chi tiết lỗi:
                      </h4>
                      <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleClose}>Đóng</Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
