import type { User } from '@/types'
import { SimpleStatsCard } from '../components/simple-stats-card'
import { UpcomingClassesCard, PendingAssignmentsCard } from '../components/teacher-cards'

interface TeacherDashboardProps {
    user: User
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Giáo viên</h1>
                <p className="text-muted-foreground">
                    Chào mừng giáo viên {user.full_name}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SimpleStatsCard icon="📚" title="Lớp học" value="5" description="Lớp đang giảng dạy" />
                <SimpleStatsCard icon="👥" title="Học viên" value="156" description="Tổng số học viên" />
                <SimpleStatsCard icon="📝" title="Bài tập" value="23" description="Bài tập chưa chấm" />
                <SimpleStatsCard icon="⭐" title="Đánh giá" value="4.8" description="Điểm đánh giá TB" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <UpcomingClassesCard />
                <PendingAssignmentsCard />
            </div>
        </div>
    )
}