import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'
import { AdminDashboard } from './admin-dashboard'
import { TeacherDashboard } from './teacher-dashboard'
import { StudentDashboard } from './student-dashboard'
import type { User } from '@/types'

export function DashboardPage() {
    const currentUser = useRecoilValue(currentUserState)

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Đang tải...</div>
            </div>
        )
    }

    // Convert currentUser to User type
    const user: User = {
        user_id: currentUser.user_id,
        full_name: currentUser.full_name || 'User',
        role: currentUser.role,
        email: currentUser.email || '',
        status: 'active',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    // Role-based rendering
    // 'user' role = student in this system
    switch (user.role) {
        case 'admin':
            return <AdminDashboard user={user} />
        case 'teacher':
            return <TeacherDashboard user={user} />
        case 'user': // user = student role
            return <StudentDashboard user={user} />
        default:
            return <StudentDashboard user={user} />
    }
}