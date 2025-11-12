import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { ClassCard } from '../components/class-card'
import { useQuery } from '@tanstack/react-query'
import { ClassService } from '@/features/teacher/api/class-service'

interface StudentDashboardProps {
    user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
    const navigate = useNavigate()

    // Fetch classes của học sinh
    const { data: classesData, isLoading } = useQuery({
        queryKey: ['student-classes', user.user_id],
        queryFn: () => ClassService.GetClassesByStudent(user.user_id),
        enabled: !!user.user_id,
    })

    const classes = classesData?.data || []

    const handleClassClick = (classId: number) => {
        navigate({ to: '/classes/detail-class', search: { id: classId } })
    }

    const handleJoinClass = () => {
        // TODO: Implement join class modal
        console.log('Open join class modal')
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
                    <p className="text-gray-600 mt-1">
                        Chào mừng {user.full_name} đến với PBL6 Learning Platform
                    </p>
                </div>
                <Button
                    onClick={handleJoinClass}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
                >
                    <Users className="h-4 w-4" />
                    <span>Tham gia nhóm</span>
                </Button>
            </div>

            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <span className="text-gray-500 text-lg">▼</span>
                    <h2 className="text-xl font-medium text-gray-900">Lớp học của tôi</h2>
                    <span className="text-gray-500">({classes.length})</span>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-600">
                        Đang tải danh sách lớp học...
                    </div>
                ) : classes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes.map((classItem) => (
                            <ClassCard
                                key={classItem.class_id}
                                id={classItem.class_id.toString()}
                                name={classItem.class_name}
                                code={classItem.class_code}
                                color="purple"
                                teacher="Giáo viên"
                                students={0}
                                onClick={() => handleClassClick(classItem.class_id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-600">
                        Bạn chưa tham gia lớp học nào. Hãy tham gia nhóm để bắt đầu!
                    </div>
                )}
            </div>
        </div>
    )
}