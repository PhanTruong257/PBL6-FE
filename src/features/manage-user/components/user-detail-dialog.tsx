import { Mail, Phone, MapPin, Calendar, Award, BookOpen, Star, User as UserIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { User } from '@/types'

interface UserDetailDialogProps {
  open: boolean
  onClose: () => void
  user: User | null
}

export function UserDetailDialog({
  open,
  onClose,
  user,
}: UserDetailDialogProps) {
  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: 'Đang hoạt động', class: 'bg-green-100 text-green-800' },
      inactive: { label: 'Không hoạt động', class: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Chờ duyệt', class: 'bg-yellow-100 text-yellow-800' },
      suspended: { label: 'Tạm khóa', class: 'bg-red-100 text-red-800' },
      blocked: { label: 'Bị khóa', class: 'bg-red-100 text-red-800' },
    }
    const config = variants[status as keyof typeof variants] || variants.inactive
    return (
      <Badge className={config.class}>
        {config.label}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      student: { label: 'Sinh viên', class: 'bg-blue-100 text-blue-800' },
      teacher: { label: 'Giảng viên', class: 'bg-purple-100 text-purple-800' },
      admin: { label: 'Quản trị viên', class: 'bg-orange-100 text-orange-800' },
    }
    const config = variants[role as keyof typeof variants] || variants.student
    return (
      <Badge className={config.class}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết người dùng</DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết của {user.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{user.full_name}</h3>
                    <div className="flex gap-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    ID: {user.user_id}
                  </p>
                  

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
              )}
              {user.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Ngày sinh: {formatDate(user.dateOfBirth)}</span>
                </div>
              )}
              {user.gender && (
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Giới tính: {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role-specific Information */}
          {user.role === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin học thuật</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Khoa</h4>
                    <p className="text-sm text-muted-foreground">{(user as any).department || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Chuyên ngành</h4>
                    <p className="text-sm text-muted-foreground">{(user as any).specialization || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Trình độ</h4>
                    <Badge variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {(user as any).qualification || 'Chưa cập nhật'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Kinh nghiệm</h4>
                    <p className="text-sm text-muted-foreground">
                      {(user as any).experience_years || 0} năm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teaching Statistics - only for teachers */}
          {user.role === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thống kê giảng dạy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-semibold">{(user as any).courses_taught || 0}</p>
                    <p className="text-sm text-muted-foreground">Khóa học đã dạy</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-semibold">{(user as any).rating?.toFixed(1) || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Đánh giá trung bình</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-semibold">{(user as any).is_verified ? 'Có' : 'Chưa'}</p>
                    <p className="text-sm text-muted-foreground">Xác minh danh tích</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Ngày tạo:</strong> {formatDate(user.created_at)}
                </span>
              </div>
              {user.updated_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Cập nhật lần cuối:</strong> {formatDate(user.updated_at)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
