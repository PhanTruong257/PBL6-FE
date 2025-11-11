import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useClassNames } from '../hooks/use-exam'

interface ExamBasicInfoProps {
  basicInfo: {
    title: string
    exam_code?: string
    description?: string
    duration?: number
    start_time: string
    end_time: string
    class_id?: number
    status?: string
    passing_score?: number
    show_results?: boolean
    shuffle_questions?: boolean
    allow_review?: boolean
  }
  onChange: (info: any) => void
}

export function ExamBasicInfo({ basicInfo, onChange }: ExamBasicInfoProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleChange = (field: string, value: any) => {
    onChange({ ...basicInfo, [field]: value })
  }

  const { data: classOptions, isLoading: isLoadingClasses } = useClassNames()

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left transition-all hover:bg-muted/50 bg-muted/30"
        type="button"
      >
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h2 className="text-xl font-semibold">Thông tin bài kiểm tra</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
        )}
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="border-t bg-background/50">
          <div className="space-y-6 p-6">
            {/* Row 1: Title, Code, Duration */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="space-y-2 md:col-span-6">
                <Label htmlFor="title" className="text-sm font-medium flex items-center gap-1">
                  Tiêu đề bài kiểm tra <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="VD: Kiểm tra giữa kỳ - Lập trình cơ bản"
                  value={basicInfo.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="h-11"
                />
              </div>



              <div className="space-y-2 md:col-span-6">
                <Label htmlFor="duration" className="text-sm font-medium">Thời gian (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="45"
                  value={basicInfo.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Row 2: Class, Start Time, End Time, Status */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="class" className="text-sm font-medium">Lớp học</Label>
                <select
                  id="class"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={basicInfo.class_id}
                  onChange={(e) => handleChange('class_id', parseInt(e.target.value))}
                  disabled={isLoadingClasses}
                >
                    <option value="">{isLoadingClasses ? 'Đang tải...' : 'Chọn lớp'}</option>
                    {classOptions != null && classOptions.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="start_time" className="text-sm font-medium">Ngày bắt đầu</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={basicInfo.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="end_time" className="text-sm font-medium">Ngày kết thúc</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={basicInfo.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
                <select
                  id="status"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={basicInfo.status || 'draft'}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="draft">Nháp</option>
                  <option value="published">Công bố</option>
                </select>
              </div>
            </div>

            {/* Row 3: Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Mô tả / Hướng dẫn cho sinh viên</Label>
              <Textarea
                id="description"
                placeholder="Ghi chú cho thi sinh, quy định làm bài..."
                value={basicInfo.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>


          </div>
        </div>
      )}
    </div>
  )
}
