import type { User } from '@/types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { SimpleStatsCard } from '../components/simple-stats-card'
import {
  UpcomingClassesCard,
  PendingAssignmentsCard,
} from '../components/teacher-cards'
import { useQuery } from '@tanstack/react-query'
import { ClassService } from '@/features/class/api/class-service'

interface TeacherDashboardProps {
  user: User
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const navigate = useNavigate()
  const [isStatsExpanded, setIsStatsExpanded] = useState(true)
  const [isCardsExpanded, setIsCardsExpanded] = useState(true)

  // Fetch classes của giáo viên để hiển thị số lượng
  const { data: classesData } = useQuery({
    queryKey: ['teacher-classes', user.user_id],
    queryFn: () => ClassService.GetClassesByTeacher(user.user_id),
    enabled: !!user.user_id,
  })

  const classes = classesData?.data || []

  const handleCreateClass = () => {
    navigate({ to: '/classes/create-class' })
  }

  const handleViewClasses = () => {
    navigate({ to: '/classes' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Giáo viên
          </h1>
          <p className="text-muted-foreground">
            Chào mừng giáo viên {user.full_name}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleViewClasses}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span>Xem lớp học</span>
          </Button>
          <Button
            onClick={handleCreateClass}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo lớp</span>
          </Button>
        </div>
      </div>

      <div>
        <button
          onClick={() => setIsStatsExpanded(!isStatsExpanded)}
          className="flex items-center space-x-2 mb-4 hover:bg-gray-100 p-2 rounded-md transition-colors -ml-2"
        >
          {isStatsExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
          <h2 className="text-lg font-medium text-gray-900">Thống kê</h2>
        </button>

        {isStatsExpanded && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SimpleStatsCard
              icon="📚"
              title="Lớp học"
              value={classes.length.toString()}
              description="Lớp đang giảng dạy"
            />
            <SimpleStatsCard
              icon="👥"
              title="Học viên"
              value="156"
              description="Tổng số học viên"
            />
            <SimpleStatsCard
              icon="📝"
              title="Bài tập"
              value="23"
              description="Bài tập chưa chấm"
            />
            <SimpleStatsCard
              icon="⭐"
              title="Đánh giá"
              value="4.8"
              description="Điểm đánh giá TB"
            />
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setIsCardsExpanded(!isCardsExpanded)}
          className="flex items-center space-x-2 mb-4 hover:bg-gray-100 p-2 rounded-md transition-colors -ml-2"
        >
          {isCardsExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
          <h2 className="text-lg font-medium text-gray-900">Chi tiết</h2>
        </button>

        {isCardsExpanded && (
          <div className="grid gap-6 lg:grid-cols-2">
            <UpcomingClassesCard />
            <PendingAssignmentsCard />
          </div>
        )}
      </div>
    </div>
  )
}
