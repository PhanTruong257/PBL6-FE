import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/components/layout/main-layout'
import { RequireAuth } from '@/components/auth/require-auth'
import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'

export const Route = createFileRoute('/classes/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <ClassesPage />
      </MainLayout>
    </RequireAuth>
  ),
})

/**
 * Classes page - role-based rendering
 * - Admin/Teacher: Can view all classes, create new classes
 * - Student: Can view enrolled classes only
 */
function ClassesPage() {
  const user = useRecoilValue(currentUserState)

  if (!user) {
    return <div>Loading...</div>
  }

  const isAdminOrTeacher = user.role === 'admin' || user.role === 'teacher'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdminOrTeacher ? 'Quản lý lớp học' : 'Lớp học của tôi'}
          </h1>
          <p className="text-muted-foreground">
            {isAdminOrTeacher
              ? 'Quản lý và tạo lớp học mới'
              : 'Danh sách lớp học bạn đã đăng ký'}
          </p>
        </div>
        {isAdminOrTeacher && (
          <a
            href="/classes/create-class"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            + Tạo lớp học mới
          </a>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample class cards - will be replaced with actual data */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              💻
            </div>
            {isAdminOrTeacher && (
              <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                Đang hoạt động
              </span>
            )}
          </div>
          <h3 className="font-semibold mb-2">Lập trình Web Frontend</h3>
          <p className="text-sm text-muted-foreground mb-4">
            React, TypeScript, TailwindCSS
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">45 học viên</span>
            <span className="text-muted-foreground">12 bài giảng</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              🗃️
            </div>
            {isAdminOrTeacher && (
              <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                Đang hoạt động
              </span>
            )}
          </div>
          <h3 className="font-semibold mb-2">Cơ sở dữ liệu</h3>
          <p className="text-sm text-muted-foreground mb-4">
            MySQL, MongoDB, Redis
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">38 học viên</span>
            <span className="text-muted-foreground">10 bài giảng</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              🎨
            </div>
            {isAdminOrTeacher && (
              <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">
                Sắp diễn ra
              </span>
            )}
          </div>
          <h3 className="font-semibold mb-2">UI/UX Design</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Figma, Design System, Prototyping
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">25 học viên</span>
            <span className="text-muted-foreground">8 bài giảng</span>
          </div>
        </div>
      </div>
    </div>
  )
}
