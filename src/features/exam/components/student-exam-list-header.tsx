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

interface StudentExamListHeaderProps {
  search: string
  onSearchChange: (value: string) => void
  status: ExamStatus | 'all'
  onStatusChange: (value: ExamStatus | 'all') => void
  startDate: string
  onStartDateChange: (value: string) => void
  endDate: string
  onEndDateChange: (value: string) => void
  onClearFilters: () => void
}

export function StudentExamListHeader({
  search,
  onSearchChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
}: StudentExamListHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <svg
              className="w-8 h-8 text-blue-600"
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
          <h1 className="text-2xl font-bold text-white">Danh sách bài kiểm tra</h1>
        </div>
        <Button 
          onClick={onClearFilters} 
          size="lg" 
          variant="outline"
          className="bg-white/10 text-white border-white/30 hover:bg-white/20"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset bộ lọc
        </Button>
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
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">TỪ NGÀY</label>
          <Input
            type="datetime-local"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="bg-white"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">ĐẾN NGÀY</label>
          <Input
            type="datetime-local"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>
    </div>
  )
}
