import type { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Users } from 'lucide-react'
import { ClassCard } from '../components/class-card'

interface StudentDashboardProps {
    user: User
}

const mockClasses = [
    {
        id: '1',
        name: 'Group_KI2_2023-2024_Lập Trình Java_22Nh11',
        code: 'GL',
        color: 'blue' as const,
        teacher: 'Nguyễn Văn A',
        students: 45
    },
    {
        id: '2',
        name: 'Group_Kỹ thuật lập trình 22.13',
        code: 'Gt',
        color: 'pink' as const,
        teacher: 'Trần Thị B',
        students: 38
    },
    {
        id: '3',
        name: 'Group_Anh Văn 2.1_32',
        code: 'GV',
        color: 'purple' as const,
        teacher: 'Smith John',
        students: 30
    },
    {
        id: '4',
        name: 'Group_PBL6-22N11B-HK1-25-26',
        code: 'G2',
        color: 'pink' as const,
        teacher: 'Lê Văn C',
        students: 25
    },
    {
        id: '5',
        name: 'Group_Kỹ 1. 25-26. Chuyên đề CN CNPM. 22.10&11',
        code: 'GC',
        color: 'blue' as const,
        teacher: 'Phạm Thị D',
        students: 42
    },
    {
        id: '6',
        name: 'Group_KTPM 22.10 T4,1 -2,F210',
        code: 'GK',
        color: 'gray' as const,
        teacher: 'Hoàng Văn E',
        students: 35
    }
]

export function StudentDashboard({ user }: StudentDashboardProps) {
    const handleClassClick = (classId: string) => {
        // Navigate to class detail
        console.log('Navigate to class:', classId)
    }

    const handleJoinClass = () => {
        // Open join class modal
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
                    <span>Tham gia hoặc tạo nhóm</span>
                </Button>
            </div>

            <div>
                <div className="flex items-center space-x-2 mb-6">
                    <span className="text-gray-500 text-lg">▼</span>
                    <h2 className="text-xl font-medium text-gray-900">Lớp học của tôi</h2>
                    <span className="text-gray-500">({mockClasses.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockClasses.map((classItem) => (
                        <ClassCard
                            key={classItem.id}
                            id={classItem.id}
                            name={classItem.name}
                            code={classItem.code}
                            color={classItem.color}
                            teacher={classItem.teacher}
                            students={classItem.students}
                            onClick={() => handleClassClick(classItem.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}