import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock } from 'lucide-react'

interface Course {
  id: string
  name: string
  progress: number
  status: 'active' | 'completed' | 'upcoming'
  lastAccessed?: string
}

interface RecentCoursesProps {
  courses: Course[]
}

export function RecentCourses({ courses }: RecentCoursesProps) {
  const getStatusBadge = (status: Course['status']) => {
    const statusConfig = {
      active: { label: 'Đang học', variant: 'default' as const },
      completed: { label: 'Hoàn thành', variant: 'secondary' as const },
      upcoming: { label: 'Sắp diễn ra', variant: 'outline' as const },
    }
    return statusConfig[status]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Khóa học gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Chưa có khóa học nào
            </p>
          ) : (
            courses.map((course) => {
              const statusBadge = getStatusBadge(course.status)
              return (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{course.name}</h4>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    {course.lastAccessed && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {course.lastAccessed}
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium">{course.progress}%</div>
                    <div className="text-xs text-muted-foreground">Tiến độ</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
