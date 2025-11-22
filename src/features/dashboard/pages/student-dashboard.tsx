import type { User } from '@/types'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { SimpleStatsCard } from '../components/simple-stats-card'
import { useQuery } from '@tanstack/react-query'
import { ClassService } from '@/features/class/api/class-service'

interface StudentDashboardProps {
  user: User
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const navigate = useNavigate()
  const [isStatsExpanded, setIsStatsExpanded] = useState(true)

  // Fetch classes của học sinh để hiển thị số lượng
  const { data: classesData } = useQuery({
    queryKey: ['student-classes', user.user_id],
    queryFn: () => ClassService.GetClassesByStudent(user.user_id),
    enabled: !!user.user_id,
  })

  const classes = classesData?.data || []

  const handleJoinClass = () => {
    navigate({ to: '/classes' })
  }

  const handleViewClasses = () => {
    navigate({ to: '/classes' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Học sinh
          </h1>
          <p className="text-gray-600 mt-1">
            Chào mừng {user.full_name} đến với PBL6 Learning Platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleViewClasses}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Xem lớp học</span>
          </Button>
          <Button
            onClick={handleJoinClass}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
          >
            <Users className="h-4 w-4" />
            <span>Tham gia lớp</span>
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
              description="Lớp đang tham gia"
            />
            <SimpleStatsCard
              icon="📝"
              title="Bài tập"
              value="12"
              description="Bài tập đã hoàn thành"
            />
            <SimpleStatsCard
              icon="🎯"
              title="Điểm TB"
              value="8.5"
              description="Điểm trung bình"
            />
            <SimpleStatsCard
              icon="⏰"
              title="Thời gian học"
              value="24h"
              description="Tuần này"
            />
          </div>
        )}
      </div>
    </div>
  )
}
