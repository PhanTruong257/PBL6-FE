import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Upload,
  MoreHorizontal,
  Share2,
  Link,
  Download,
  Filter,
  SortAsc,
  Search,
  Folder,
  FileText,
  File,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { type Material_full_info, FileType } from '@/types/material'
import {
  uploadMaterials,
  downloadMaterial,
  deleteMaterial,
} from '../hooks/use-class-detail'
import { useQueryClient } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import type { ClassBasicInfo } from '@/types/class'

interface MaterialsViewProps {
  materials: Material_full_info[]
  classInfo: ClassBasicInfo
}

export function MaterialsView({ materials, classInfo }: MaterialsViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const currentUser = useRecoilValue(currentUserState)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    if (!currentUser) {
      alert('Bạn cần đăng nhập để upload file')
      return
    }

    setIsUploading(true)
    try {
      const fileArray = Array.from(files)
      await uploadMaterials(classInfo.class_id, fileArray, currentUser.user_id)

      // Refresh materials list
      queryClient.invalidateQueries({ queryKey: ['class', classInfo.class_id] })

      alert(`Đã upload ${fileArray.length} file thành công!`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Có lỗi xảy ra khi upload file')
    } finally {
      setIsUploading(false)
      // Reset input
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  const handleDownload = async (material: Material_full_info) => {
    try {
      // Extract filename from file_url (e.g., "/materials/download/filename.pdf")
      const filename = material.file_url.split('/').pop()
      if (!filename) {
        throw new Error('Invalid file URL')
      }

      const blob = await downloadMaterial(filename)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = material.title || filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Có lỗi xảy ra khi tải file')
    }
  }

  const handleDelete = async (materialId: number) => {
    if (!confirm('Bạn có chắc muốn xóa file này?')) {
      return
    }

    try {
      await deleteMaterial(materialId)

      // Refresh materials list
      queryClient.invalidateQueries({ queryKey: ['class', classInfo.class_id] })

      alert('Đã xóa file thành công!')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Có lỗi xảy ra khi xóa file')
    }
  }

  const handleCopyLink = (material: Material_full_info) => {
    const fullUrl = `${window.location.origin}${material.file_url}`
    navigator.clipboard.writeText(fullUrl)
    alert('Đã copy link!')
  }

  const filteredMaterials = materials.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFileIcon = (file_type: FileType) => {
    switch (file_type) {
      case FileType.audio:
        return <FileText className="h-6 w-6 text-red-600" />
      case FileType.video:
        return <FileText className="h-6 w-6 text-blue-600" />
      case FileType.image:
        return <File className="h-6 w-6 text-green-600" />
      case FileType.document:
        return <File className="h-6 w-6 text-yellow-600" />
      default:
        return <File className="h-6 w-6 text-gray-600" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Toolbar */}
      <div className="px-6 py-1.5   ">
        <div className="flex items-center justify-between mb-4">
          {/* Left side actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Đang upload...' : 'Upload'}
            </Button>

            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="*/*"
        />
        {/* 
        Search and filters */}
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Column headers for list view */}

      <div className="px-6 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Upload at</div>
          <div className="col-span-3">Upload by</div>
          <div className="col-span-2">Size</div>
        </div>
      </div>
      {/* Content */}
      <div className="px-6 py-4 flex-1 overflow-y-auto">
        {filteredMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Folder className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-600">
              Chưa có tài liệu nào
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hãy tải lên tài liệu đầu tiên cho lớp
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredMaterials.map((item) => (
              <div
                key={item.material_id}
                className="grid grid-cols-12 gap-4 p-2 hover:bg-gray-50 rounded-md cursor-pointer group"
              >
                <div className="col-span-5 flex items-center space-x-3">
                  {getFileIcon(item.type)}
                  <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {item.title}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-gray-600">
                    {formatDate(item.uploaded_at)}
                  </span>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-gray-600">
                    {item.uploaded_by.full_name || item.uploaded_by.email}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {formatFileSize(item.file_size)}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleDownload(item)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(item)}>
                        <Link className="h-4 w-4 mr-2" />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(item.material_id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
