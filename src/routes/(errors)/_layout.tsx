import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(errors)/_layout')({
  component: ErrorLayout
})

function ErrorLayout() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Outlet />
    </div>
  )
}