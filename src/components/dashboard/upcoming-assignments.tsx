import { CalendarIcon, ClockIcon, BookOpenIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function UpcomingAssignments() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">Mathematics: Calculus Quiz</h3>
              <Badge>Due Tomorrow</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due Oct 28, 11:59 PM</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="mr-1 h-4 w-4" />
              <span>30 minutes</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpenIcon className="mr-1 h-4 w-4" />
              <span>Professor Williams</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">Physics: Lab Report</h3>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due Oct 30, 11:59 PM</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Progress: 60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">Computer Science: Programming Assignment</h3>
              <Badge variant="outline">Not Started</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due Nov 2, 11:59 PM</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <ClockIcon className="mr-1 h-4 w-4" />
              <span>Estimated: 3 hours</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpenIcon className="mr-1 h-4 w-4" />
              <span>Professor Johnson</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">English: Essay Draft</h3>
              <Badge variant="secondary">In Progress</Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due Nov 5, 11:59 PM</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <span>Progress: 25%</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}