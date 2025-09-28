import { BarChart3, Settings, Users, BookOpen, GraduationCap, LogOut } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { useAppStore } from '@/store'
import { useLogout } from '@/hooks/auth/useAuth'
import { ROUTES } from '@/utils/constants/routes'

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
  { icon: Users, label: 'Quản lý người dùng', path: ROUTES.ADMIN_USERS },
  { icon: BookOpen, label: 'Quản lý khóa học', path: ROUTES.ADMIN_COURSES },
  { icon: GraduationCap, label: 'Quản lý giảng viên', path: ROUTES.ADMIN_TEACHERS },
  { icon: BarChart3, label: 'Thống kê', path: ROUTES.ADMIN_ANALYTICS },
  { icon: Settings, label: 'Cài đặt', path: ROUTES.ADMIN_SETTINGS },
]

export const AdminSidebar: React.FC = () => {
  const { sidebarCollapsed } = useAppStore()
  const location = useLocation()
  const logout = useLogout()

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-xl font-bold">Admin</span>
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
              className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                isActive ? 'bg-gray-800 text-white border-r-2 border-primary' : ''
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
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-lg"
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