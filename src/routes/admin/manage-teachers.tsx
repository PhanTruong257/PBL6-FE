import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/manage-teachers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/manage-teachers"!</div>
}
