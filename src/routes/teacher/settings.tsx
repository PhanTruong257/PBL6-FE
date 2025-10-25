import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/teacher/settings"!</div>
}
