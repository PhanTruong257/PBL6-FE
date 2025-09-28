import { Bell, Menu, Search, User } from 'lucide-react'
import { useAuthStore, useAppStore } from '@/store'

export const StudentHeader: React.FC = () => {
  const { user } = useAuthStore()
  const { toggleSidebar } = useAppStore()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">Student Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-80"
            />
          </div>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              1
            </span>
          </button>
          
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 rounded-full bg-gray-300 p-1" />
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-500">Học viên</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}