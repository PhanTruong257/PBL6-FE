import { StatsCard } from '../components/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, GraduationCap, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock data for system statistics
const mockSystemActivity = [
  {
    id: '1',
    type: 'user',
    action: 'Người dùng mới đăng ký',
    user: 'Nguyễn Văn A',
    time: '5 phút trước',
  },
  {
    id: '2',
    type: 'course',
    action: 'Khóa học mới được tạo',
    user: 'Trần Thị B',
    time: '15 phút trước',
  },
  {
    id: '3',
    type: 'exam',
    action: 'Kỳ thi được lên lịch',
    user: 'Lê Văn C',
    time: '1 giờ trước',
  },
]

export function AdminDashboardPage() {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  const getActivityBadge = (type: string) => {
    const badgeConfig: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'outline' }
    > = {
      user: { label: 'Người dùng', variant: 'default' },
      course: { label: 'Khóa học', variant: 'secondary' },
      exam: { label: 'Kỳ thi', variant: 'outline' },
    }
    return badgeConfig[type] ?? badgeConfig['user']
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {getTimeBasedGreeting()}, Admin
        </h1>
        <p className="text-muted-foreground">
          Đây là tổng quan về hệ thống quản lý học tập
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={BookOpen}
          title="Tổng khóa học"
          value="32"
          subtitle="Đang hoạt động"
          trend={{ value: '+4 so với tháng trước', isPositive: true }}
        />
        <StatsCard
          icon={Users}
          title="Tổng người dùng"
          value="215"
          subtitle="Đã đăng ký"
          trend={{ value: '+18 so với tháng trước', isPositive: true }}
        />
        <StatsCard
          icon={GraduationCap}
          title="Giảng viên"
          value="12"
          subtitle="Đang hoạt động"
        />
        <StatsCard
          icon={Users}
          title="Sinh viên"
          value="203"
          subtitle="Đã đăng ký"
          trend={{ value: '+15 so với tháng trước', isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSystemActivity.map((activity) => {
                const badge = getActivityBadge(activity.type)
                return (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Khóa học phổ biến nhất</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lập trình Web cơ bản
                  </p>
                </div>
                <div className="text-2xl font-bold">89</div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Tỷ lệ hoàn thành</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trung bình tất cả khóa học
                  </p>
                </div>
                <div className="text-2xl font-bold">76%</div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Người dùng hoạt động</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trong 24 giờ qua
                  </p>
                </div>
                <div className="text-2xl font-bold">142</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
