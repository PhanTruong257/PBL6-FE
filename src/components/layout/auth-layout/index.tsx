import { AuthHeader } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Header */}
      <AuthHeader />
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}