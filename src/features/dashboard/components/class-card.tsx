import { Button } from '@/components/ui/button'
import { MoreHorizontal, Calendar, Users, BookOpen } from 'lucide-react'

interface ClassCardProps {
    id: string
    name: string
    code: string
    color: 'blue' | 'pink' | 'purple' | 'gray'
    teacher?: string
    students?: number
    onClick?: () => void
}

const colorClasses = {
    blue: 'bg-blue-500',
    pink: 'bg-pink-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
}

export function ClassCard({ name, code, color, teacher, students, onClick }: ClassCardProps) {
    return (
        <div
            className="bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            {/* Header with colored background */}
            <div className={`${colorClasses[color]} p-4 text-white`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            {code}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white line-clamp-2 text-sm leading-5">
                                {name}
                            </h3>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation()
                            console.log('More options for:', name)
                        }}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Action icons */}
                <div className="flex items-center space-x-1 mb-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Calendar className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Users className="h-4 w-4 text-gray-500" />
                    </Button>
                </div>

                {/* Footer info */}
                {(teacher || students) && (
                    <div className="text-xs text-gray-500 space-y-1">
                        {teacher && <div>Giảng viên: {teacher}</div>}
                        {students && <div>{students} học viên</div>}
                    </div>
                )}
            </div>
        </div>
    )
}