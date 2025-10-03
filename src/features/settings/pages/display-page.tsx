import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export function DisplayPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hiển thị</CardTitle>
          <CardDescription>
            Tùy chỉnh cách hiển thị nội dung
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-base">Kích thước font chữ</Label>
              <RadioGroup defaultValue="medium" className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small" className="font-normal cursor-pointer">
                    Nhỏ
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="font-normal cursor-pointer">
                    Trung bình
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large" className="font-normal cursor-pointer">
                    Lớn
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chế độ nén</Label>
                <p className="text-sm text-muted-foreground">
                  Hiển thị nhiều nội dung hơn trên màn hình
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sidebar thu gọn</Label>
                <p className="text-sm text-muted-foreground">
                  Tự động thu gọn sidebar khi không sử dụng
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Hiệu ứng chuyển động</Label>
                <p className="text-sm text-muted-foreground">
                  Bật/tắt hiệu ứng chuyển động và animation
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
