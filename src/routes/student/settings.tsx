import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/settings"!</div>
}
