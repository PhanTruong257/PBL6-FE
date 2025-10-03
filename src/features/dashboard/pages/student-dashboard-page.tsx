import { StatsCard } from '../components/stats-card'
import { RecentCourses } from '../components/recent-courses'
import { UpcomingExams } from '../components/upcoming-exams'
import { BookOpen, CheckCircle, Clock, FileSpreadsheet } from 'lucide-react'

// Mock data
const mockCourses = [
  {
    id: '1',
    name: 'Lập trình Web cơ bản',
    progress: 75,
    status: 'active' as const,
    lastAccessed: '2 giờ trước',
  },
  {
    id: '2',
    name: 'Cơ sở dữ liệu',
    progress: 100,
    status: 'completed' as const,
    lastAccessed: '1 ngày trước',
  },
  {
    id: '3',
    name: 'Trí tuệ nhân tạo',
    progress: 0,
    status: 'upcoming' as const,
  },
]

const mockExams = [
  {
    id: '1',
    title: 'Kiểm tra giữa kỳ',
    course: 'Lập trình Web cơ bản',
    date: '15/10/2025',
    duration: 90,
    status: 'upcoming' as const,
  },
  {
    id: '2',
    title: 'Bài tập lớn',
    course: 'Cơ sở dữ liệu',
    date: '20/10/2025',
    duration: 120,
    status: 'upcoming' as const,
  },
]

export function StudentDashboardPage() {
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
          Đây là tổng quan về quá trình học tập của bạn
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={BookOpen}
          title="Khóa học đang theo"
          value="5"
          subtitle="Đã đăng ký"
          trend={{ value: '+2 so với kỳ trước', isPositive: true }}
        />
        <StatsCard
          icon={CheckCircle}
          title="Khóa học hoàn thành"
          value="3"
          subtitle="Đã hoàn tất"
          trend={{ value: '+1 tháng này', isPositive: true }}
        />
        <StatsCard
          icon={Clock}
          title="Giờ học"
          value="42"
          subtitle="Tuần này"
          trend={{ value: '+5h so với tuần trước', isPositive: true }}
        />
        <StatsCard
          icon={FileSpreadsheet}
          title="Kỳ thi sắp tới"
          value="2"
          subtitle="Trong tháng này"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentCourses courses={mockCourses} />
        <UpcomingExams exams={mockExams} />
      </div>
    </div>
  )
}
