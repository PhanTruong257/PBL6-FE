import { Button } from '@/components/ui/button'
import {
    MoreHorizontal,
    Settings,
    UserPlus,
    Users
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ClassService } from '@/features/teacher/api/class-service'

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
    onToggleSettings: () => void
}

export function ClassDetailHeader({
    classInfo,
    isTeacher,
    onAddMember,
    onToggleSettings
}: ClassDetailHeaderProps) {
    // Fetch student count
    const { data: studentsData } = useQuery({
        queryKey: ['class-students', classInfo.class_id],
        queryFn: () => ClassService.GetStudentsOfClass(classInfo.class_id),
        enabled: !!classInfo.class_id,
    })

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
                        <h1 className="text-xl font-semibold text-gray-900">{classInfo.class_name}</h1>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Class</span>
                            {studentsData && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                        <Users className="h-3 w-3" />
                                        <span>{studentsData.total_students} {studentsData.total_students === 1 ? 'student' : 'students'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {isTeacher && (
                        <Button variant="ghost" size="icon" onClick={onAddMember}>
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
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