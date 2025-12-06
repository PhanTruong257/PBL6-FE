import { Button } from '@/components/ui/button'
import { MoreHorizontal, Settings, UserPlus, Users, Upload } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { cookieStorage } from '@/libs/utils/cookie'
import { useEffect } from 'react'

interface ClassDetailHeaderProps {
  classInfo: {
    class_name: string
    class_id: number
    class_code: string
    teacher_id?: number
    description?: string
    created_at: Date | string
    updated_at?: Date | string
  }
  isTeacher: boolean
  onAddMember: () => void
  onImportStudents: () => void
  onToggleSettings: () => void
}

const fetchStudentCount = async (classId: number): Promise<number> => {
  const token = cookieStorage.getAccessToken()
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/classes/${classId}/students`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    return 0
  }

  const json = await res.json()

  // Backend returns { data: { class_id, total_students, students: [...] } }
  if (json.data?.total_students !== undefined) {
    return json.data.total_students
  }

  // Fallback: count from students array
  if (json.data?.students && Array.isArray(json.data.students)) {
    return json.data.students.length
  }

  if (Array.isArray(json.data)) {
    return json.data.length
  }

  return 0
}

export function ClassDetailHeader({
  classInfo,
  isTeacher,
  onAddMember,
  onImportStudents,
  onToggleSettings,
}: ClassDetailHeaderProps) {
  const queryClient = useQueryClient()

  // Fetch student count
  const { data: studentCount = 0, refetch } = useQuery({
    queryKey: ['class-students-count', classInfo.class_id],
    queryFn: () => fetchStudentCount(classInfo.class_id),
    enabled: !!classInfo.class_id,
  })

  // Listen to query cache updates for class-students to refetch count
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      // When students list is invalidated or updated, refetch the count
      if (
        event.query.queryKey[0] === 'class-students' &&
        event.query.queryKey[1] === classInfo.class_id
      ) {
        refetch()
      }
    })
    return unsubscribe
  }, [classInfo.class_id, queryClient, refetch])

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {classInfo.class_name?.substring(0, 2)}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {classInfo.class_name}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Class</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>
                  {studentCount} {studentCount === 1 ? 'student' : 'students'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isTeacher && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onAddMember}
                title="Thêm học sinh"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onImportStudents}
                title="Import Excel"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </>
          )}

          {isTeacher && (
            <Button variant="ghost" size="icon" onClick={onToggleSettings}>
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
