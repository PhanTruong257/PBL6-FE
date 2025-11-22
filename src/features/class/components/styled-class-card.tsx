import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Calendar,
  Users,
  BookOpen,
  Trash2,
  Edit,
} from 'lucide-react'
import { getColorFromId, type ClassColor } from '@/libs/color-utils'
import { cookieStorage } from '@/libs/utils/cookie'
import { useQueryClient } from '@tanstack/react-query'

interface StyledClassCardProps {
  id: string | number
  name: string
  code: string
  teacher?: string
  teacherAvatar?: string
  students?: number
  onClick?: () => void
  isTeacher?: boolean
}

// Color themes using Tailwind classes
const colorThemes: Record<
  ClassColor,
  {
    bg: string
    hover: string
    light: string
    gradient: string
  }
> = {
  blue: {
    bg: 'bg-blue-500',
    hover: 'hover:bg-blue-600',
    light: 'bg-blue-50',
    gradient: 'from-blue-600 to-blue-500',
  },
  pink: {
    bg: 'bg-pink-500',
    hover: 'hover:bg-pink-600',
    light: 'bg-pink-50',
    gradient: 'from-pink-600 to-pink-500',
  },
  purple: {
    bg: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    light: 'bg-purple-50',
    gradient: 'from-purple-600 to-purple-500',
  },
  gray: {
    bg: 'bg-gray-500',
    hover: 'hover:bg-gray-600',
    light: 'bg-gray-50',
    gradient: 'from-gray-600 to-gray-500',
  },
  green: {
    bg: 'bg-green-500',
    hover: 'hover:bg-green-600',
    light: 'bg-green-50',
    gradient: 'from-green-600 to-green-500',
  },
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-600',
    light: 'bg-orange-50',
    gradient: 'from-orange-600 to-orange-500',
  },
  teal: {
    bg: 'bg-teal-500',
    hover: 'hover:bg-teal-600',
    light: 'bg-teal-50',
    gradient: 'from-teal-600 to-teal-500',
  },
  indigo: {
    bg: 'bg-indigo-500',
    hover: 'hover:bg-indigo-600',
    light: 'bg-indigo-50',
    gradient: 'from-indigo-600 to-indigo-500',
  },
}

export function StyledClassCard({
  id,
  name,
  code,
  teacher,
  teacherAvatar,
  students = 0,
  onClick,
  isTeacher = false,
}: StyledClassCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(name)
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()

  const color = getColorFromId(id)
  const theme = colorThemes[color]
  const teacherInitial = teacher?.charAt(0).toUpperCase() || 'T'

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!confirm(`Bạn có chắc muốn xóa lớp "${name}"?`)) return

    setIsDeleting(true)
    try {
      const token = cookieStorage.getAccessToken()
      const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) throw new Error('Failed to delete class')

      const json = await res.json()

      if (json.success) {
         queryClient.invalidateQueries({ queryKey: ['teacher-classes'] })
        queryClient.invalidateQueries({ queryKey: ['student-classes'] })
      } else {
        alert(json.message || 'Không thể xóa lớp học')
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Có lỗi xảy ra khi xóa lớp học')
    } finally {
      setIsDeleting(false)
      setShowMenu(false)
    }
  }

  const handleRename = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!newName.trim()) {
      alert('Tên lớp không được bỏ trống')
      return
    }

    try {
      const token = cookieStorage.getAccessToken()
      const res = await fetch(`${import.meta.env.VITE_API_URL}/classes/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_name: newName.trim(),
          class_code: code,
        }),
      })

      if (!res.ok) throw new Error('Failed to rename class')

      const json = await res.json()

      if (json.success) {
        alert('Đổi tên lớp học thành công!')
        queryClient.invalidateQueries({ queryKey: ['teacher-classes'] })
        queryClient.invalidateQueries({ queryKey: ['student-classes'] })
        setIsRenaming(false)
      } else {
        alert(json.message || 'Không thể đổi tên lớp học')
      }
    } catch (error) {
      console.error('Error renaming class:', error)
      alert('Có lỗi xảy ra khi đổi tên lớp học')
    } finally {
      setShowMenu(false)
    }
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] h-full flex flex-col"
      onClick={onClick}
    >
      {/* Header with colored background - Compact height */}
      <div className={`${theme.bg} px-5 py-5 relative`}>
        {/* Layout ngang: Icon bên trái, Text giữa, More button bên phải */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-lg">
            {code.substring(0, 3).toUpperCase()}
          </div>

          {/* Class name and code - flex-1 để chiếm không gian giữa */}
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1">
              {name}
            </h3>
            <div className="text-white/95 text-sm font-semibold">
              Mã: {code}
            </div>
          </div>

          {/* More button */}
          {isTeacher && (
            <div className="relative flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/10 hover:bg-white/25 text-white border-none rounded-lg"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>

              {/* Dropdown menu */}
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsRenaming(true)
                      setShowMenu(false)
                    }}
                    disabled={isDeleting}
                  >
                    <Edit className="h-4 w-4" />
                    Đổi tên lớp
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeleting ? 'Đang xóa...' : 'Xóa lớp học'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body - Minimalist padding */}
      <div className="px-4 py-3 bg-white flex-1 flex flex-col justify-between">
        {/* Teacher info - compact */}
        {teacher && (
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs font-semibold flex-shrink-0 overflow-hidden">
              {teacherAvatar ? (
                <img
                  src={teacherAvatar}
                  alt={teacher}
                  className="w-full h-full object-cover"
                />
              ) : (
                teacherInitial
              )}
            </div>
            <div className="text-xs text-gray-600 font-medium truncate">
              {teacher}
            </div>
          </div>
        )}

        {/* Action buttons - Minimalist */}
        <div className="flex gap-0.5 pt-2.5 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 px-0 hover:bg-gray-50 text-gray-500 rounded"
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 px-0 hover:bg-gray-50 text-gray-500 rounded"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 px-0 hover:bg-gray-50 text-gray-500 gap-1 rounded"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">{students}</span>
          </Button>
        </div>
      </div>

      {/* Rename Dialog */}
      {isRenaming && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation()
            setIsRenaming(false)
            setNewName(name)
          }}
        >
          <div
            className="bg-white rounded-lg p-6 w-96 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Đổi tên lớp học</h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên mới"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(e as any)
                if (e.key === 'Escape') {
                  setIsRenaming(false)
                  setNewName(name)
                }
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsRenaming(false)
                  setNewName(name)
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
                onClick={handleRename}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
