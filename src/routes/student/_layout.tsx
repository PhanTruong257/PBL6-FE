import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/_layout')({
  component: RouteComponent
})

function RouteComponent() {
  return <div className="container py-6">
    <Outlet />
  </div>
}
