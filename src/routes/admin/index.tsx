import { createFileRoute } from '@tanstack/react-router'
import { 
  LineChart, 
  BarChart, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  Calendar, 
  Activity 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard
})

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="default" size="sm">
            <Activity className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">56</div>
                <p className="text-xs text-muted-foreground">
                  +4 new this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Students
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">890</div>
                <p className="text-xs text-muted-foreground">
                  +9% from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Teachers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  +2 new teachers joined
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Registration Overview</CardTitle>
                <CardDescription>
                  Monthly new user registrations for the past year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-16 w-16" />
                  <span className="ml-2">Chart would render here</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Course Engagement</CardTitle>
                <CardDescription>
                  Top 5 most engaged courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full flex items-center justify-center text-muted-foreground">
                  <BarChart className="h-16 w-16" />
                  <span className="ml-2">Chart would render here</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest system activities and events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="rounded-full p-2 bg-primary/10">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {['New user registration', 'Course created', 'Assignment submitted', 'Exam graded', 'Forum post added'][i]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {['2 minutes ago', '10 minutes ago', '25 minutes ago', '1 hour ago', '3 hours ago'][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Scheduled events for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="rounded-full p-2 bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">
                          {['System Maintenance', 'Teacher Training Workshop', 'End of Semester Meeting'][i]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {['Tomorrow, 2:00 AM', 'Friday, 10:00 AM', 'Sunday, 1:00 PM'][i]}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <LineChart className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Analytics Dashboard</h3>
            <p>Detailed analytics would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Reports Dashboard</h3>
            <p>Generated reports would be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="h-[300px] flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Activity className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Notifications Center</h3>
            <p>System notifications would be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
