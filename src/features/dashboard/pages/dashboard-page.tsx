import { useDashboard } from '../hooks'
import { AdminDashboard } from './admin-dashboard'
import { TeacherDashboard } from './teacher-dashboard'
import { StudentDashboard } from './student-dashboard'
import { useState } from 'react'
import type { User } from '@/types'

export function DashboardPage() {
    // const { user, isLoading } = useDashboard()

    // if (isLoading || !user) {
    //     return (
    //         <div className="flex items-center justify-center min-h-[400px]">
    //             <div className="text-muted-foreground">Đang tải...</div>
    //         </div>
    //     )
    // }

    const [user, setUser] = useState<User>({
        user_id: 2,
        full_name: 'Nguyễn Văn A',
        role: 'user',
        email: 'nguyen.a@student.edu.vn',
        status: 'active',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })

    // Role-based rendering
    switch (user.role) {
        case 'admin':
            return <AdminDashboard user={user} />
        case 'teacher':
            return <TeacherDashboard user={user} />
        default:
            return <StudentDashboard user={user} />
    }
}