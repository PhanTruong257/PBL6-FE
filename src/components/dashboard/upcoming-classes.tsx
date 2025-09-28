import { CalendarIcon, UsersIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function UpcomingClasses() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Introduction to Mathematics</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>Today, 10:00 - 11:30 AM</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <UsersIcon className="mr-1 h-4 w-4" />
                <span>32 students</span>
              </div>
            </div>
            <Badge>In Progress</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Advanced Physics</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>Today, 2:00 - 3:30 PM</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <UsersIcon className="mr-1 h-4 w-4" />
                <span>18 students</span>
              </div>
            </div>
            <Badge variant="outline">Upcoming</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Computer Science Fundamentals</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>Tomorrow, 9:00 - 11:00 AM</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <UsersIcon className="mr-1 h-4 w-4" />
                <span>25 students</span>
              </div>
            </div>
            <Badge variant="outline">Upcoming</Badge>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">English Literature</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>Tomorrow, 1:00 - 2:30 PM</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <UsersIcon className="mr-1 h-4 w-4" />
                <span>20 students</span>
              </div>
            </div>
            <Badge variant="outline">Upcoming</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}