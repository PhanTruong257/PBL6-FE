import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/dashboard/"!</div>
}
