import { useQuery } from '@tanstack/react-query'
import { cookieStorage } from '@/libs/utils/cookie'
import type { User } from '@/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, UserCircle } from 'lucide-react'

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
    }
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
    }
  )

  if (!userRes.ok) {
    throw new Error('Failed to fetch user profiles')
  }

  const userJson = await userRes.json()
  return userJson.data?.users || []
}

export function StudentsView({ classId }: StudentsViewProps) {
  const { data: students, isLoading, error } = useQuery({
    queryKey: ['class-students', classId],
    queryFn: () => fetchStudents(classId),
    enabled: !!classId,
  })

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
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Danh sách sinh viên
          </h2>
          <p className="text-gray-600 mt-1">
            Tổng số: {studentsList.length} sinh viên
          </p>
        </div>

        {studentsList.length === 0 ? (
          <Card>
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
          <div className="grid gap-4">
            {studentsList.map((student, index) => (
              <Card key={student.user_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                          {student.full_name
                            ? student.full_name.charAt(0).toUpperCase()
                            : student.email?.charAt(0).toUpperCase() || 'S'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 font-medium">
                          #{index + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {student.full_name || 'Unnamed Student'}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-600 truncate">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {student.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
