import { useState, useEffect } from 'react'
import { DeleteClassModal } from './delete-class-modal'
import type { ClassBasicInfo } from '@/types/class'
import { cookieStorage } from '@/libs/utils/cookie'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

interface ClassSettingsProps {
  onBack: () => void
  classInfo: ClassBasicInfo
}

export function ClassSettings({ onBack, classInfo }: ClassSettingsProps) {
  const [isDeleteClassModalOpen, setDeleteClassModalOpen] =
    useState<boolean>(false)
  const [className, setClassName] = useState<string>('')
  const [classCode, setClassCode] = useState<string>('')
  const [classDescription, setClassDescription] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Fetch class data from API when component mounts
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setIsLoading(true)
        const token = cookieStorage.getAccessToken()
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/classes/${classInfo.class_id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (!res.ok) {
          throw new Error('Failed to fetch class data')
        }

        const json = await res.json()

        if (json.success && json.data) {
          const classData = json.data
          setClassName(classData.class_name || '')
          setClassCode(classData.class_code || '')
          setClassDescription(classData.description || '')
        } else {
          alert('Không thể tải thông tin lớp học')
        }
      } catch (error) {
        console.error('Error fetching class data:', error)
        alert('Có lỗi xảy ra khi tải thông tin lớp học')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassData()
  }, [classInfo.class_id])

  const handleDeleteClass = async (classId: string) => {
    try {
      const token = cookieStorage.getAccessToken()
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/classes/${classId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!res.ok) {
        throw new Error('Failed to delete class')
      }

      const json = await res.json()

      if (json.success) {
         // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['teacher-classes'] })
        queryClient.invalidateQueries({ queryKey: ['student-classes'] })
        // Navigate back to classes list
        navigate({ to: '/classes' })
      } else {
        alert(json.message || 'Không thể xóa lớp học')
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Có lỗi xảy ra khi xóa lớp học')
    }
  }

  const handleUpdateClass = async () => {
    // Validation
    if (!className.trim()) {
      alert('Tên lớp không được bỏ trống')
      return
    }

    if (classCode.length !== 5) {
      alert('Mã lớp học phải có đúng 5 ký tự')
      return
    }

    setIsUpdating(true)

    try {
      const token = cookieStorage.getAccessToken()
      const updatedClass = {
        class_name: className.trim(),
        class_code: classCode.trim().toUpperCase(),
        description: classDescription.trim(),
        teacher_id: classInfo.teacher_id,
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/classes/${classInfo.class_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedClass),
        },
      )

      if (!res.ok) {
        throw new Error('Failed to update class')
      }

      const json = await res.json()

      if (json.success) {
        alert('Cập nhật lớp học thành công!')
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['teacher-classes'] })
        queryClient.invalidateQueries({ queryKey: ['student-classes'] })
        queryClient.invalidateQueries({
          queryKey: ['class-detail', classInfo.class_id],
        })
        // Go back to previous view
        onBack()
      } else {
        alert(json.message || 'Không thể cập nhật lớp học')
      }
    } catch (error) {
      console.error('Error updating class:', error)
      alert('Có lỗi xảy ra khi cập nhật lớp học')
    } finally {
      setIsUpdating(false)
    }
  }

  const isFormValid = className.trim().length > 0 && classCode.length === 5

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex-1 p-6 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin lớp học...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Class Information Section */}
        <div className="bg-indigo-500 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <span className="text-sm font-semibold">📚</span>
            </div>
            <h2 className="text-lg font-semibold">Thông tin lớp học</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Tên lớp học *
              </label>
              <input
                type="text"
                placeholder="VD: Lập trình hướng đối tượng"
                className="w-full px-3 py-2 bg-white bg-opacity-90 border border-white border-opacity-30 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                disabled={isUpdating}
              />
              {className.length <= 0 && (
                <p className="text-xs mt-1 text-red-200">
                  Tên lớp không được bỏ trống
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mã lớp *</label>
              <input
                type="text"
                maxLength={5}
                placeholder="VD: CS101"
                className="w-full px-3 py-2 bg-white bg-opacity-90 border border-white border-opacity-30 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                disabled={isUpdating}
              />
              {classCode.length !== 5 && (
                <p className="text-xs mt-1 text-red-200">
                  Mã lớp học phải có đúng 5 ký tự
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Mô tả lớp học
            </label>
            <textarea
              placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của lớp học..."
              rows={3}
              className="w-full px-3 py-2 bg-white bg-opacity-90 border border-white border-opacity-30 rounded text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              value={classDescription}
              onChange={(e) => setClassDescription(e.target.value)}
              disabled={isUpdating}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            disabled={isUpdating}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quay lại
          </button>
          <div className="space-x-3">
            <button
              onClick={() => setDeleteClassModalOpen(true)}
              disabled={isUpdating}
              className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xóa lớp học
            </button>
            <button
              onClick={handleUpdateClass}
              disabled={!isFormValid || isUpdating}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {/* Delete Class Modal */}
        <DeleteClassModal
          classId={classInfo.class_id.toString()}
          isOpen={isDeleteClassModalOpen}
          onDeleteClass={handleDeleteClass}
          onOpenChange={setDeleteClassModalOpen}
          classTitle={classInfo.class_name}
        />
      </div>
    </div>
  )
}
