import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/')({
  component: StudentDashboard
})

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Enrolled Courses</h3>
          <p className="text-2xl font-bold">6</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Assignments Due</h3>
          <p className="text-2xl font-bold">4</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Overall Progress</h3>
          <p className="text-2xl font-bold">78%</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Upcoming Exams</h3>
          <p className="text-2xl font-bold">2</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Courses</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Mathematics 101</span>
              <span className="text-sm text-green-500">85%</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Physics 201</span>
              <span className="text-sm text-blue-500">78%</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Chemistry 301</span>
              <span className="text-sm text-yellow-500">72%</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Math Assignment #3</span>
              <span className="text-sm text-red-500">Due Tomorrow</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Physics Lab Report</span>
              <span className="text-sm text-yellow-500">Due in 3 days</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Chemistry Exam</span>
              <span className="text-sm text-blue-500">Due in 1 week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
