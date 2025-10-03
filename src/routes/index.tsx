import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/components/layout/main-layout'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chào mừng đến với PBL6 Learning Platform</h1>
          <p className="text-muted-foreground">
            Hệ thống quản lý học tập trực tuyến hiện đại và thân thiện.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                📚
              </div>
              <h3 className="font-semibold">Khóa học</h3>
            </div>
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">Khóa học đã đăng ký</p>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                📝
              </div>
              <h3 className="font-semibold">Bài tập</h3>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Bài tập cần hoàn thành</p>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                🎯
              </div>
              <h3 className="font-semibold">Tiến độ</h3>
            </div>
            <p className="text-2xl font-bold">78%</p>
            <p className="text-sm text-muted-foreground">Hoàn thành khóa học</p>
          </div>
          
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                ⭐
              </div>
              <h3 className="font-semibold">Điểm số</h3>
            </div>
            <p className="text-2xl font-bold">8.5</p>
            <p className="text-sm text-muted-foreground">Điểm trung bình</p>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Khóa học gần đây</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  💻
                </div>
                <div className="flex-1">
                  <p className="font-medium">Lập trình Web Frontend</p>
                  <p className="text-sm text-muted-foreground">React, TypeScript</p>
                </div>
                <div className="text-sm text-muted-foreground">85%</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  🗃️
                </div>
                <div className="flex-1">
                  <p className="font-medium">Cơ sở dữ liệu</p>
                  <p className="text-sm text-muted-foreground">MySQL, MongoDB</p>
                </div>
                <div className="text-sm text-muted-foreground">92%</div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  🎨
                </div>
                <div className="flex-1">
                  <p className="font-medium">UI/UX Design</p>
                  <p className="text-sm text-muted-foreground">Figma, Design System</p>
                </div>
                <div className="text-sm text-muted-foreground">67%</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Thông báo mới</h3>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-500/5 border-l-4 border-blue-500">
                <p className="font-medium text-sm">Bài tập mới đã được giao</p>
                <p className="text-sm text-muted-foreground">Lập trình Web Frontend - Deadline: 25/12/2024</p>
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/5 border-l-4 border-green-500">
                <p className="font-medium text-sm">Điểm kiểm tra đã có</p>
                <p className="text-sm text-muted-foreground">Cơ sở dữ liệu - Điểm: 9.2/10</p>
              </div>
              
              <div className="p-3 rounded-lg bg-orange-500/5 border-l-4 border-orange-500">
                <p className="font-medium text-sm">Lịch học thay đổi</p>
                <p className="text-sm text-muted-foreground">UI/UX Design - Chuyển sang thứ 5 tuần sau</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
