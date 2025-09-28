import { BookOpen, Users, FileText, BarChart3, LogOut, Home } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { useAppStore } from '@/store'
import { useLogout } from '@/hooks/auth/useAuth'
import { ROUTES } from '@/utils/constants/routes'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: ROUTES.TEACHER_DASHBOARD },
  { icon: BookOpen, label: 'Khóa học của tôi', path: ROUTES.TEACHER_COURSES },
  { icon: FileText, label: 'Bài học', path: ROUTES.TEACHER_LESSONS },
  { icon: FileText, label: 'Bài tập', path: ROUTES.TEACHER_ASSIGNMENTS },
  { icon: Users, label: 'Học viên', path: ROUTES.TEACHER_STUDENTS },
  { icon: BarChart3, label: 'Thống kê', path: '/teacher/analytics' },
]

export const TeacherSidebar: React.FC = () => {
  const { sidebarCollapsed } = useAppStore()
  const location = useLocation()
  const logout = useLogout()

  return (
    <div className={`bg-blue-900 text-white transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold">Teacher</span>
          )}
        </div>
      </div>

      <nav className="mt-8">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors ${
                isActive ? 'bg-blue-800 text-white border-r-2 border-blue-400' : ''
              }`}
            >
              <Icon className="h-5 w-5" />
              {!sidebarCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </a>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <button
          onClick={() => logout.mutate()}
          className="flex items-center w-full px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white transition-colors rounded-lg"
        >
          <LogOut className="h-5 w-5" />
          {!sidebarCollapsed && (
            <span className="ml-3">Đăng xuất</span>
          )}
        </button>
      </div>
    </div>
  )
}