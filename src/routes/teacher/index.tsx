import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/')({
  component: TeacherDashboard
})

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">My Classes</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Students</h3>
          <p className="text-2xl font-bold">156</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Assignments</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Upcoming Exams</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Classes</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Mathematics 101</span>
              <span className="text-sm text-muted-foreground">32 students</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Physics 201</span>
              <span className="text-sm text-muted-foreground">28 students</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Tasks</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Grade Math Quiz</span>
              <span className="text-sm text-red-500">Due Today</span>
            </div>
            <div className="flex justify-between items-center p-2 border rounded">
              <span>Prepare Physics Lab</span>
              <span className="text-sm text-yellow-500">Due Tomorrow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
