import { Bell, Search, User } from 'lucide-react'
import { useAuthStore } from '@/store'

export const PublicHeader: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">ELearning</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-gray-700 hover:text-primary">Trang chủ</a>
          <a href="/courses" className="text-gray-700 hover:text-primary">Khóa học</a>
          <a href="/about" className="text-gray-700 hover:text-primary">Giới thiệu</a>
          <a href="/contact" className="text-gray-700 hover:text-primary">Liên hệ</a>
        </nav>

        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <a 
                href="/login" 
                className="text-gray-700 hover:text-primary"
              >
                Đăng nhập
              </a>
              <a 
                href="/register" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Đăng ký
              </a>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Search className="h-5 w-5 text-gray-500" />
              <Bell className="h-5 w-5 text-gray-500" />
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}