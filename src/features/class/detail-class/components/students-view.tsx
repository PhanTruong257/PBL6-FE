import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { cookieStorage } from '@/libs/utils/cookie'
import type { User } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, UserCircle, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClassService } from '@/features/class/api/class-service'
import { toast } from '@/libs/toast'

interface StudentsViewProps {
  classId: number
}

interface StudentResponse {
  success: boolean
  message: string
  data: {
    class_id: number
    total_students: number
    students: Array<{
      student_id: number
      enrolled_at: string
    }>
  }
}

const fetchStudents = async (classId: number): Promise<User[]> => {
  const token = cookieStorage.getAccessToken()

  // Step 1: Get student IDs from class
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/classes/${classId}/students`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch students')
  }

  const json: StudentResponse = await res.json()

  // Handle different response formats
  let studentIds: number[] = []
  if (json.data?.students && Array.isArray(json.data.students)) {
    studentIds = json.data.students.map((s) => s.student_id)
  }

  if (studentIds.length === 0) {
    return []
  }

  // Step 2: Get user details from user service
  const userRes = await fetch(
    `${import.meta.env.VITE_API_URL}/users/get-list-profile-by-ids`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userIds: studentIds,
      }),
    },
  )

  if (!userRes.ok) {
    throw new Error('Failed to fetch user profiles')
  }

  const userJson = await userRes.json()
  return userJson.data?.users || []
}

export function StudentsView({ classId }: StudentsViewProps) {
  const queryClient = useQueryClient()

  const {
    data: students,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['class-students', classId],
    queryFn: () => fetchStudents(classId),
    enabled: !!classId,
  })

  // Remove student mutation
  const removeStudentMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await ClassService.removeStudent(classId, userId)
    },
    onSuccess: () => {
      toast.success('Đã xóa sinh viên khỏi lớp')
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['class-students', classId] })
      queryClient.invalidateQueries({
        queryKey: ['class-students-count', classId],
      })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa sinh viên')
    },
  })

  const handleDeleteStudent = (student: User) => {
    if (
      confirm(
        `Bạn có chắc muốn xóa sinh viên ${student.full_name || student.email} khỏi lớp?`,
      )
    ) {
      removeStudentMutation.mutate(student.user_id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8 text-gray-500">
            Đang tải danh sách sinh viên...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8 text-red-500">
            Có lỗi xảy ra khi tải danh sách sinh viên
          </div>
        </div>
      </div>
    )
  }

  const studentsList = students || []

  return (
    <div className="flex flex-col h-full w-full p-4 bg-gray-50">
      <div className="w-full flex flex-col h-full">
        <div className="mb-3 flex-shrink-0">
          <p className="text-sm text-gray-600">
            Tổng số: {studentsList.length} sinh viên
          </p>
        </div>

        {studentsList.length === 0 ? (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserCircle className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                Chưa có sinh viên nào trong lớp
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Thêm sinh viên để bắt đầu
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2">
              {studentsList.map((student, index) => (
                <div
                  key={student.user_id}
                  className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                >
                  {/* Number */}
                  <span className="text-xs text-gray-400 font-medium">
                    #{index + 1}
                  </span>

                  {/* Avatar */}
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                      {student.full_name
                        ? student.full_name.charAt(0).toUpperCase()
                        : student.email?.charAt(0).toUpperCase() || 'S'}
                    </AvatarFallback>
                  </Avatar>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {student.full_name || 'Unnamed Student'}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <p className="text-xs text-gray-600 truncate">
                        {student.email}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {student.status === 'active'
                      ? 'Hoạt động'
                      : 'Không hoạt động'}
                  </span>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeleteStudent(student)}
                        disabled={removeStudentMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {removeStudentMutation.isPending
                          ? 'Đang xóa...'
                          : 'Xóa khỏi lớp'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
