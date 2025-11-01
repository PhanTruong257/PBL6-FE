import type { User } from '@/types'
import { SimpleStatsCard } from '../components/simple-stats-card'
import { SystemStatsCard, RecentActivitiesCard } from '../components/admin-cards'

interface AdminDashboardProps {
    user: User
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Chào mừng quản trị viên {user.full_name}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SimpleStatsCard icon="👥" title="Người dùng" value="1,245" description="Tổng số người dùng" />
                <SimpleStatsCard icon="📚" title="Lớp học" value="87" description="Tổng số lớp học" />
                <SimpleStatsCard icon="👨‍🏫" title="Giáo viên" value="45" description="Giáo viên đang hoạt động" />
                <SimpleStatsCard icon="📊" title="Hoạt động" value="95%" description="Tỷ lệ hoạt động" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <SystemStatsCard />
                <RecentActivitiesCard />
            </div>
        </div>
    )
}