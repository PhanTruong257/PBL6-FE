import { StatsCard } from '../components/stats-card'
import { RecentCourses } from '../components/recent-courses'
import { UpcomingExams } from '../components/upcoming-exams'
import { BookOpen, Users, FileSpreadsheet, CalendarDays } from 'lucide-react'

// Mock data
const mockCourses = [
  {
    id: '1',
    name: 'Lập trình Web cơ bản',
    progress: 60,
    status: 'active' as const,
    lastAccessed: '1 giờ trước',
  },
  {
    id: '2',
    name: 'Cơ sở dữ liệu',
    progress: 100,
    status: 'completed' as const,
    lastAccessed: '3 ngày trước',
  },
]

const mockExams = [
  {
    id: '1',
    title: 'Kiểm tra giữa kỳ - Web',
    course: 'Lập trình Web cơ bản',
    date: '15/10/2025',
    duration: 90,
    status: 'upcoming' as const,
  },
]

export function TeacherDashboardPage() {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getTimeBasedGreeting()}
        </h1>
        <p className="text-muted-foreground">
          Đây là tổng quan về các lớp học và sinh viên của bạn
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={BookOpen}
          title="Khóa học đang dạy"
          value="3"
          subtitle="Đang hoạt động"
        />
        <StatsCard
          icon={Users}
          title="Tổng sinh viên"
          value="78"
          subtitle="Trong các lớp"
          trend={{ value: '+12 so với kỳ trước', isPositive: true }}
        />
        <StatsCard
          icon={FileSpreadsheet}
          title="Bài tập chờ chấm"
          value="15"
          subtitle="Cần xem xét"
        />
        <StatsCard
          icon={CalendarDays}
          title="Lớp học sắp tới"
          value="5"
          subtitle="Trong tuần này"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentCourses courses={mockCourses} />
        <UpcomingExams exams={mockExams} />
      </div>
    </div>
  )
}
