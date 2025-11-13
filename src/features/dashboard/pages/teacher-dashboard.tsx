import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { SimpleStatsCard } from '../components/simple-stats-card'
import { UpcomingClassesCard, PendingAssignmentsCard } from '../components/teacher-cards'
import { useQuery } from '@tanstack/react-query'
import { ClassService } from '@/features/teacher/api/class-service'
import { ClassCard } from '../components/class-card'

interface TeacherDashboardProps {
    user: User
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
    const navigate = useNavigate()

    // Fetch classes của giáo viên
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Giáo viên</h1>
                    <p className="text-muted-foreground">
                        Chào mừng giáo viên {user.full_name}
                    </p>
                </div>
                <Button
                    onClick={handleCreateClass}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    <span>Tạo lớp</span>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SimpleStatsCard 
                    icon="📚" 
                    title="Lớp học" 
                    value={classes.length.toString()} 
                    description="Lớp đang giảng dạy" 
                />
                <SimpleStatsCard icon="👥" title="Học viên" value="156" description="Tổng số học viên" />
                <SimpleStatsCard icon="📝" title="Bài tập" value="23" description="Bài tập chưa chấm" />
                <SimpleStatsCard icon="⭐" title="Đánh giá" value="4.8" description="Điểm đánh giá TB" />
            </div>

            {/* Danh sách lớp học */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-lg">▼</span>
                    <h2 className="text-xl font-medium text-gray-900">Lớp học của tôi</h2>
                    <span className="text-gray-500">({classes.length})</span>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
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
                                color="blue"
                                teacher={user.full_name}
                                students={0}
                                onClick={() => handleClassClick(classItem.class_id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        Chưa có lớp học nào. Hãy tạo lớp học đầu tiên!
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <UpcomingClassesCard />
                <PendingAssignmentsCard />
            </div>
        </div>
    )
}