import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(errors)/500')({
  component: ServerErrorPage
})

function ServerErrorPage() {
  return (
    <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div className="max-w-md text-center">
        <h2 className="mb-8 font-extrabold text-9xl">
          <span className="sr-only">Error</span>
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">500</span>
        </h2>
        <p className="text-3xl font-semibold md:text-3xl mb-8">
          Server error
        </p>
        <p className="mt-4 mb-8 text-muted-foreground">
          Sorry, something went wrong on our server. Please try again later.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/">Go back home</Link>
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}