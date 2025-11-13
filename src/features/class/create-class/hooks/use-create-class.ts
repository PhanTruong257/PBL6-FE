import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  ClassService,
  type CreateClassRequest,
} from '@/features/teacher/api/class-service'

export function useCreateClass() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClassRequest) => ClassService.CreateClass(data),
    onSuccess: (response) => {
      console.log('✅ Create class response:', response)
      console.log('✅ Response type:', typeof response)
      console.log(
        '✅ Response keys:',
        response ? Object.keys(response) : 'null',
      )

      // Check if response has expected structure
      if (!response) {
        console.error('❌ Response is null or undefined')
        toast.error('Lỗi không xác định', {
          description: 'Response rỗng từ server',
        })
        return
      }

      // Handle different response formats
      // Format 1: { message: string, class: {...} }
      if ('class' in response && response.class) {
        const className = response.class.class_name || 'lớp học'
        const classCode = response.class.class_code || ''

        toast.success('Tạo lớp học thành công!', {
          description: classCode
            ? `Lớp "${className}" đã được tạo với mã ${classCode}`
            : `Lớp "${className}" đã được tạo`,
        })
      }
      // Format 2: Direct class object { class_id, class_name, ... }
      else if ('class_id' in response && 'class_name' in response) {
        const className = (response as any).class_name || 'lớp học'
        const classCode = (response as any).class_code || ''

        toast.success('Tạo lớp học thành công!', {
          description: classCode
            ? `Lớp "${className}" đã được tạo với mã ${classCode}`
            : `Lớp "${className}" đã được tạo`,
        })
      }
      // Fallback: Generic success message
      else {
        console.warn('⚠️ Unexpected response format:', response)
        toast.success('Tạo lớp học thành công!')
      }

      // Invalidate classes list to refetch
      queryClient.invalidateQueries({ queryKey: ['classes'] })

      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 1000)
    },
    onError: (error: any) => {
      console.error('❌ FE: Error creating class:', error)
      console.error('❌ FE: Error response:', error?.response)
      console.error('❌ FE: Error response data:', error?.response?.data)

      // Handle specific error cases
      // Error response format: { success: false, message: string, data: null, error: string }
      const errorData = error?.response?.data
      const errorMessage =
        errorData?.message || error?.message || 'Không xác định'
      const errorType = errorData?.error || 'Unknown'

      console.log('❌ FE: Parsed error -', { errorMessage, errorType })

      // Handle duplicate class code
      if (
        errorMessage.includes('Mã lớp đã tồn tại') ||
        errorMessage.includes('DUPLICATE_CLASS_CODE') ||
        errorMessage.includes('Unique constraint') ||
        errorMessage.includes('already exists')
      ) {
        toast.error('Mã lớp đã tồn tại', {
          description: 'Vui lòng chọn mã lớp khác',
        })
      }
      // Handle timeout
      else if (
        errorMessage.includes('timeout') ||
        errorMessage.includes('Timeout')
      ) {
        toast.error('Kết nối timeout', {
          description: 'Vui lòng thử lại sau',
        })
      }
      // Handle unauthorized
      else if (error?.response?.status === 401) {
        toast.error('Không có quyền', {
          description: 'Bạn không có quyền tạo lớp học',
        })
      }
      // Handle teacher not found
      else if (
        errorMessage.includes('Giáo viên không tồn tại') ||
        errorMessage.includes('teacher')
      ) {
        toast.error('Lỗi giáo viên', {
          description: errorMessage,
        })
      }
      // Generic error
      else {
        toast.error('Tạo lớp học thất bại', {
          description: errorMessage,
        })
      }
    },
  })
}
