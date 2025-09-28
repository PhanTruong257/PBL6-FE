import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(errors)/503')({
  component: MaintenancePage
})

function MaintenancePage() {
  return (
    <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
      <div className="max-w-md text-center">
        <h2 className="mb-8 font-extrabold text-9xl">
          <span className="sr-only">Error</span>
          <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">503</span>
        </h2>
        <p className="text-3xl font-semibold md:text-3xl mb-8">
          Under maintenance
        </p>
        <p className="mt-4 mb-8 text-muted-foreground">
          We're currently performing maintenance on our system. Please check back soon.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <a href="https://status.yourdomain.com" target="_blank" rel="noreferrer">
              Check status
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}