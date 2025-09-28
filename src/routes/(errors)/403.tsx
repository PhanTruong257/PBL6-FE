import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(errors)/403')({
  component: ForbiddenPage
})

function ForbiddenPage() {
  return (
    <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div className="max-w-md text-center">
        <h2 className="mb-8 font-extrabold text-9xl">
          <span className="sr-only">Error</span>
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">403</span>
        </h2>
        <p className="text-3xl font-semibold md:text-3xl mb-8">
          Access forbidden
        </p>
        <p className="mt-4 mb-8 text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}