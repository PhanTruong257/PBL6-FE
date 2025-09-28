import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(errors)/401')({
  component: UnauthorizedPage
})

function UnauthorizedPage() {
  return (
    <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div className="max-w-md text-center">
        <h2 className="mb-8 font-extrabold text-9xl">
          <span className="sr-only">Error</span>
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">401</span>
        </h2>
        <p className="text-3xl font-semibold md:text-3xl mb-8">
          Unauthorized
        </p>
        <p className="mt-4 mb-8 text-muted-foreground">
          You need to be logged in to access this page.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/auth/sign-in">Sign in</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}