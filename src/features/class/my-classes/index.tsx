import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ClassService } from '@/features/teacher/api/class-service'
import { StyledClassCard } from '@/features/class/components/styled-class-card'
import { JoinClassModal } from '@/features/class/components/join-class-modal'
import { useState } from 'react'

/**
 * Main page for My Classes - renders different views based on user role
 */
export function MyClassesPage() {
  const currentUser = useRecoilValue(currentUserState)
  const navigate = useNavigate()
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  // Render based on user role
  if (currentUser.role === 'teacher' || currentUser.role === 'admin') {
    return <TeacherClassesView user={currentUser} navigate={navigate} />
  }

  return (
    <StudentClassesView
      user={currentUser}
      navigate={navigate}
      isJoinModalOpen={isJoinModalOpen}
      setIsJoinModalOpen={setIsJoinModalOpen}
    />
  )
}

/**
 * Teacher view for classes page
 */
function TeacherClassesView({ user, navigate }: { user: User; navigate: any }) {
  const { data: classesData, isLoading } = useQuery({
    queryKey: ['teacher-classes', user.user_id],
    queryFn: () => ClassService.GetClassesByTeacher(user.user_id),
    enabled: !!user.user_id,
  })

  const classes = classesData?.data || []

  const handleCreateClass = () => {
    navigate({ to: '/classes/create-class' })
  }

  const handleClassClick = (classId: number) => {
    navigate({ to: '/classes/detail-class', search: { id: classId } })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lớp học của tôi
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý tất cả lớp học bạn đang giảng dạy
          </p>
        </div>
        <Button
          onClick={handleCreateClass}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo lớp mới</span>
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">
              Đang tải danh sách lớp học...
            </p>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((classItem) => (
              <StyledClassCard
                key={classItem.class_id}
                id={classItem.class_id}
                name={classItem.class_name}
                code={classItem.class_code}
                teacher={user.full_name}
                teacherAvatar={user.avatar}
                students={classItem.enrollments?.length || 0}
                onClick={() => handleClassClick(classItem.class_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có lớp học nào
            </h3>
            <p className="text-muted-foreground mb-4">
              Hãy tạo lớp học đầu tiên của bạn!
            </p>
            <Button
              onClick={handleCreateClass}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo lớp học
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Student view for classes page
 */
function StudentClassesView({
  user,
  navigate,
  isJoinModalOpen,
  setIsJoinModalOpen,
}: {
  user: User
  navigate: any
  isJoinModalOpen: boolean
  setIsJoinModalOpen: (open: boolean) => void
}) {
  const { data: classesData, isLoading } = useQuery({
    queryKey: ['student-classes', user.user_id],
    queryFn: () => ClassService.GetClassesByStudent(user.user_id),
    enabled: !!user.user_id,
  })

  const classes = classesData?.data || []

  const handleJoinClass = () => {
    setIsJoinModalOpen(true)
  }

  const handleClassClick = (classId: number) => {
    navigate({ to: '/classes/detail-class', search: { id: classId } })
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Lớp học của tôi
          </h1>
          <p className="text-muted-foreground mt-2">
            Tất cả lớp học bạn đang tham gia
          </p>
        </div>
        <Button
          onClick={handleJoinClass}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 shadow-md"
        >
          <Users className="h-4 w-4" />
          <span>Tham gia lớp</span>
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">
              Đang tải danh sách lớp học...
            </p>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((classItem) => (
              <StyledClassCard
                key={classItem.class_id}
                id={classItem.class_id}
                name={classItem.class_name}
                code={classItem.class_code}
                teacher="Giáo viên"
                students={classItem.enrollments?.length || 0}
                onClick={() => handleClassClick(classItem.class_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-purple-50 rounded-lg border-2 border-dashed border-purple-300">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa tham gia lớp học nào
            </h3>
            <p className="text-muted-foreground mb-4">
              Hãy tham gia lớp học để bắt đầu học tập!
            </p>
            <Button
              onClick={handleJoinClass}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Tham gia lớp
            </Button>
          </div>
        )}
      </div>

      <JoinClassModal
        isOpen={isJoinModalOpen}
        onOpenChange={setIsJoinModalOpen}
      />
    </div>
  )
}
