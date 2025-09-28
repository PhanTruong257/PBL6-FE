import { BookOpen, Play, TrendingUp, LogOut, Home, Award } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { useAppStore } from '@/store'
import { useLogout } from '@/hooks/auth/useAuth'
import { ROUTES } from '@/utils/constants/routes'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: ROUTES.STUDENT_DASHBOARD },
  { icon: BookOpen, label: 'Khóa học của tôi', path: ROUTES.STUDENT_COURSES },
  { icon: Play, label: 'Học tập', path: ROUTES.STUDENT_LEARNING },
  { icon: TrendingUp, label: 'Tiến độ học tập', path: ROUTES.STUDENT_PROGRESS },
  { icon: Award, label: 'Chứng chỉ', path: '/student/certificates' },
]

export const StudentSidebar: React.FC = () => {
  const { sidebarCollapsed } = useAppStore()
  const location = useLocation()
  const logout = useLogout()

  return (
    <div className={`bg-green-900 text-white transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold">Student</span>
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
              className={`flex items-center px-4 py-3 text-green-100 hover:bg-green-800 hover:text-white transition-colors ${
                isActive ? 'bg-green-800 text-white border-r-2 border-green-400' : ''
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
          className="flex items-center w-full px-4 py-3 text-green-100 hover:bg-green-800 hover:text-white transition-colors rounded-lg"
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