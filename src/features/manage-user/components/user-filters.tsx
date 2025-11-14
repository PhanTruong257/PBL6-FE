import { Search, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import type { UserFilters } from '../types'

interface UserFiltersComponentProps {
  filters: UserFilters
  onFiltersChange: (filters: Partial<UserFilters>) => void
  onReset: () => void
}

export function UserFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onReset 
}: UserFiltersComponentProps) {
  const roles = [
    { value: 'user', label: 'Sinh viên' },
    { value: 'teacher', label: 'Giảng viên' },
  ]

  const genders = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tên hoặc Email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập tên hoặc email..."
                  value={filters.text || ''}
                  onChange={(e) => onFiltersChange({ text: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium mb-2 block">Trạng thái</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => onFiltersChange({ status: value === 'all' ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="blocked">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium mb-2 block">Vai trò</label>
              <Select
                value={filters.role || 'all'}
                onValueChange={(value) => onFiltersChange({ role: value === 'all' ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất cả vai trò" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="all">Tất cả</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium mb-2 block">Giới tính</label>
              <Select
                value={filters.gender || 'all'}
                onValueChange={(value) => onFiltersChange({ gender: value === 'all' ? undefined : value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tất cả giới tính" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="all">Tất cả</SelectItem>
                  {genders.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ngày sinh</label>
              <Input
                type="date"
                value={filters.birthday || ''}
                onChange={(e) => onFiltersChange({ birthday: e.target.value })}
                placeholder="Chọn ngày"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Hiển thị:</label>
              <Select
                value={filters.limit?.toString() || '5'}
                onValueChange={(value) => onFiltersChange({ limit: parseInt(value), page: 1 })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">kết quả/trang</span>
            </div>
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
