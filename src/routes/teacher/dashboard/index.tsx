import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/teacher/dashboard/"!</div>
}
