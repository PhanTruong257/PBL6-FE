import { Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/store'
import { AdminHeader } from './Header/AdminHeader'
import { TeacherHeader } from './Header/TeacherHeader'
import { StudentHeader } from './Header/StudentHeader'
import { PublicHeader } from './Header/PublicHeader'
import { AdminSidebar } from './Sidebar/AdminSidebar'
import { TeacherSidebar } from './Sidebar/TeacherSidebar'
import { StudentSidebar } from './Sidebar/StudentSidebar'

export const Layout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <main>
          <Outlet />
        </main>
      </div>
    )
  }

  const renderRoleBasedLayout = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="min-h-screen bg-background flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
              <AdminHeader />
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </div>
        )
      case 'teacher':
        return (
          <div className="min-h-screen bg-background flex">
            <TeacherSidebar />
            <div className="flex-1 flex flex-col">
              <TeacherHeader />
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </div>
        )
      case 'student':
        return (
          <div className="min-h-screen bg-background flex">
            <StudentSidebar />
            <div className="flex-1 flex flex-col">
              <StudentHeader />
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </div>
        )
      default:
        return (
          <div className="min-h-screen bg-background">
            <PublicHeader />
            <main>
              <Outlet />
            </main>
          </div>
        )
    }
  }

  return renderRoleBasedLayout()
}