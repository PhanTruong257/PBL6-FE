import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
          <CardDescription>
            Quản lý cách bạn nhận thông báo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo email</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo qua email
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo khóa học</Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo về khóa học và bài tập mới
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo kỳ thi</Label>
                <p className="text-sm text-muted-foreground">
                  Nhắc nhở về kỳ thi sắp tới
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo điểm số</Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo khi có điểm mới
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Thông báo hệ thống</Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo về cập nhật và bảo trì hệ thống
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
