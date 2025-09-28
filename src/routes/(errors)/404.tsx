import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(errors)/404')({
  component: NotFoundPage
})

function NotFoundPage() {
  return (
    <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div className="max-w-md text-center">
        <h2 className="mb-8 font-extrabold text-9xl">
          <span className="sr-only">Error</span>
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">404</span>
        </h2>
        <p className="text-3xl font-semibold md:text-3xl mb-8">
          Page not found
        </p>
        <p className="mt-4 mb-8 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
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