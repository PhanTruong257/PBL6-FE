import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/403')({
  component: ForbiddenPage,
})

export function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="text-center space-y-6 p-8 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="w-12 h-12 text-destructive" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2">
          <h1 className="text-7xl font-bold text-destructive">403</h1>
          <h2 className="text-2xl font-semibold">Không có quyền truy cập</h2>
        </div>

        {/* Message */}
        <p className="text-muted-foreground">
          Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên
          nếu bạn cho rằng đây là lỗi.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
