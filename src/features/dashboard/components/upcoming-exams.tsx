import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar } from 'lucide-react'

interface Exam {
  id: string
  title: string
  course: string
  date: string
  duration: number
  status: 'upcoming' | 'in-progress' | 'completed'
}

interface UpcomingExamsProps {
  exams: Exam[]
}

export function UpcomingExams({ exams }: UpcomingExamsProps) {
  const getStatusBadge = (status: Exam['status']) => {
    const statusConfig = {
      upcoming: { label: 'Sắp diễn ra', variant: 'secondary' as const },
      'in-progress': { label: 'Đang thi', variant: 'default' as const },
      completed: { label: 'Đã hoàn thành', variant: 'outline' as const },
    }
    return statusConfig[status]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Kỳ thi sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exams.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Không có kỳ thi nào
            </p>
          ) : (
            exams.map((exam) => {
              const statusBadge = getStatusBadge(exam.status)
              return (
                <div
                  key={exam.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{exam.title}</h4>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exam.course}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exam.date}
                      </div>
                      <div>Thời gian: {exam.duration} phút</div>
                    </div>
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
