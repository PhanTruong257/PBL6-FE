import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'

/**
 * Unified dashboard route with role-based rendering
 * Shows different content based on user role and permissions
 */
export const Route = createFileRoute('/dashboard/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    </RequireAuth>
  ),
})

function DashboardPage() {
  const user = useRecoilValue(currentUserState)

  if (!user) {
    return <div>Loading...</div>
  }

  // Role-based rendering
  if (user.role === 'admin') {
    return <AdminDashboard user={user} />
  }

  if (user.role === 'teacher') {
    return <TeacherDashboard user={user} />
  }

  return <StudentDashboard user={user} />
}

/**
 * Admin Dashboard
 */
function AdminDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Chào mừng quản trị viên {user.fullName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="👥" title="Người dùng" value="1,245" description="Tổng số người dùng" />
        <StatCard icon="📚" title="Lớp học" value="87" description="Tổng số lớp học" />
        <StatCard icon="👨‍🏫" title="Giáo viên" value="45" description="Giáo viên đang hoạt động" />
        <StatCard icon="📊" title="Hoạt động" value="95%" description="Tỷ lệ hoạt động" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SystemStatsCard />
        <RecentActivitiesCard />
      </div>
    </div>
  )
}

/**
 * Teacher Dashboard
 */
function TeacherDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Giáo viên</h1>
        <p className="text-muted-foreground">
          Chào mừng giáo viên {user.fullName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="📚" title="Lớp học" value="5" description="Lớp đang giảng dạy" />
        <StatCard icon="👥" title="Học viên" value="156" description="Tổng số học viên" />
        <StatCard icon="📝" title="Bài tập" value="23" description="Bài tập chưa chấm" />
        <StatCard icon="⭐" title="Đánh giá" value="4.8" description="Điểm đánh giá TB" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingClassesCard />
        <PendingAssignmentsCard />
      </div>
    </div>
  )
}

/**
 * Student Dashboard
 */
function StudentDashboard({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Học viên</h1>
        <p className="text-muted-foreground">
          Chào mừng {user.fullName} đến với PBL6 Learning Platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="📚" title="Khóa học" value="6" description="Khóa học đã đăng ký" />
        <StatCard icon="📝" title="Bài tập" value="12" description="Bài tập cần hoàn thành" />
        <StatCard icon="🎯" title="Tiến độ" value="78%" description="Hoàn thành khóa học" />
        <StatCard icon="⭐" title="Điểm số" value="8.5" description="Điểm trung bình" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentCoursesCard />
        <NotificationsCard />
      </div>
    </div>
  )
}

/**
 * Reusable Components
 */
function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: string
  title: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function SystemStatsCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Thống kê hệ thống</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Người dùng mới (tuần này)</span>
          <span className="font-semibold">+45</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Lớp học mới</span>
          <span className="font-semibold">+12</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Tỷ lệ hoạt động</span>
          <span className="font-semibold text-green-600">95%</span>
        </div>
      </div>
    </div>
  )
}

function RecentActivitiesCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
      <div className="space-y-3">
        <ActivityItem
          title="Người dùng mới đăng ký"
          description="Nguyễn Văn A đã đăng ký tài khoản"
          time="5 phút trước"
        />
        <ActivityItem
          title="Lớp học mới được tạo"
          description="Lập trình Python cơ bản"
          time="15 phút trước"
        />
        <ActivityItem
          title="Bài tập được nộp"
          description="23 bài tập mới được nộp"
          time="1 giờ trước"
        />
      </div>
    </div>
  )
}

function UpcomingClassesCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Lớp học sắp tới</h3>
      <div className="space-y-3">
        <ClassItem
          name="Lập trình Web Frontend"
          time="Thứ 2, 14:00 - 16:00"
          students={45}
        />
        <ClassItem name="Cơ sở dữ liệu" time="Thứ 4, 09:00 - 11:00" students={38} />
        <ClassItem name="UI/UX Design" time="Thứ 6, 15:00 - 17:00" students={25} />
      </div>
    </div>
  )
}

function PendingAssignmentsCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Bài tập cần chấm</h3>
      <div className="space-y-3">
        <AssignmentItem name="Bài tập React Hooks" pending={12} total={45} />
        <AssignmentItem name="Thiết kế Database" pending={8} total={38} />
        <AssignmentItem name="Prototype Design" pending={3} total={25} />
      </div>
    </div>
  )
}

function RecentCoursesCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Khóa học gần đây</h3>
      <div className="space-y-3">
        <CourseItem
          icon="💻"
          name="Lập trình Web Frontend"
          description="React, TypeScript"
          progress={85}
        />
        <CourseItem
          icon="🗃️"
          name="Cơ sở dữ liệu"
          description="MySQL, MongoDB"
          progress={92}
        />
        <CourseItem
          icon="🎨"
          name="UI/UX Design"
          description="Figma, Design System"
          progress={67}
        />
      </div>
    </div>
  )
}

function NotificationsCard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Thông báo mới</h3>
      <div className="space-y-3">
        <NotificationItem
          type="info"
          title="Bài tập mới đã được giao"
          description="Lập trình Web Frontend - Deadline: 25/12/2024"
        />
        <NotificationItem
          type="success"
          title="Điểm kiểm tra đã có"
          description="Cơ sở dữ liệu - Điểm: 9.2/10"
        />
        <NotificationItem
          type="warning"
          title="Lịch học thay đổi"
          description="UI/UX Design - Chuyển sang thứ 5 tuần sau"
        />
      </div>
    </div>
  )
}

// Helper components
function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="p-3 rounded-lg hover:bg-muted/50">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
      <p className="text-xs text-muted-foreground mt-1">{time}</p>
    </div>
  )
}

function ClassItem({ name, time, students }: { name: string; time: string; students: number }) {
  return (
    <div className="p-3 rounded-lg hover:bg-muted/50">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-sm text-muted-foreground">{time}</p>
      <p className="text-xs text-muted-foreground mt-1">{students} học viên</p>
    </div>
  )
}

function AssignmentItem({ name, pending, total }: { name: string; pending: number; total: number }) {
  return (
    <div className="p-3 rounded-lg hover:bg-muted/50">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-sm text-muted-foreground">
        {pending} chưa chấm / {total} bài nộp
      </p>
    </div>
  )
}

function CourseItem({
  icon,
  name,
  description,
  progress,
}: {
  icon: string
  name: string
  description: string
  progress: number
}) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-sm text-muted-foreground">{progress}%</div>
    </div>
  )
}

function NotificationItem({
  type,
  title,
  description,
}: {
  type: 'info' | 'success' | 'warning'
  title: string
  description: string
}) {
  const colors = {
    info: 'border-blue-500 bg-blue-500/5',
    success: 'border-green-500 bg-green-500/5',
    warning: 'border-orange-500 bg-orange-500/5',
  }

  return (
    <div className={`p-3 rounded-lg border-l-4 ${colors[type]}`}>
      <p className="font-medium text-sm">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

