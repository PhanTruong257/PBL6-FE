import { Search, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ExamStatus } from '@/types/exam'

interface ExamListHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  status: ExamStatus | 'all'
  onStatusChange: (value: ExamStatus | 'all') => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  onCreateClick: () => void
  onClearFilters: () => void
}

export function ExamListHeader({
  search,
  onSearchChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onCreateClick,
  onClearFilters,
}: ExamListHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Quản lý bài kiểm tra</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onClearFilters} 
            size="lg" 
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset bộ lọc
          </Button>
          <Button onClick={onCreateClick} size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
            + Tạo bài kiểm tra mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <label className="block text-white text-sm font-medium mb-2">TÌM KIẾM</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Tìm theo tiêu đề bài kiểm tra..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">TRẠNG THÁI</label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="published">Công khai</SelectItem>
              <SelectItem value="in_progress">Đang diễn ra</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">TỪ NGÀY</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">ĐÉN NGÀY</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  )
}
