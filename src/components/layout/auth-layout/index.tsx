import { AuthHeader } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Header */}
      <AuthHeader />
      
      {/* Main Content */}
      <main 
        className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background/30 to-muted"
      >
        {/* Children form */}
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
