import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/courses')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/(student)/courses"!</div>
}
