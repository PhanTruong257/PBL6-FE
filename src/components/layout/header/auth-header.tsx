import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggler'
import { LanguageToggle } from '@/components/language-toggle'
import { Link, useRouter } from '@tanstack/react-router'

export function AuthHeader() {
  const router = useRouter()
  const currentPath = router.state.location.pathname
  console.log('Current Path:', currentPath)

  // Check current path to conditionally render buttons
  const isLoginPage = currentPath === '/auth/login' // Render Register button
  const isRegisterPage = currentPath === '/auth/register' // Render Login button

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 w-full max-w-screen-2xl mx-auto items-center justify-between px-0 sm:px-4">
        {/* Grid layout for left part */}
        <div className="grid grid-cols-3 items-center w-full">
          {/* Logo - Left Part */}
          <Link to="/" className="flex items-center space-x-2">
            {/* Logo Image */}
            <img
              src="/logo.png"
              alt="PBL6 Logo"
              className="h-10 w-10 object-contain"
            />

            {/* Brand Name */}
            <span className="hidden font-bold text-lg sm:inline-block">
              PBL6 Learning
            </span>
          </Link>

          {/* Empty Space - Center Part */}
          <div className="flex items-center justify-center"></div>

          {/* Actions - Right Part */}
          <div className="flex items-center gap-2 justify-self-end">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Show buttons if not on login or register page */}
            {!isLoginPage && !isRegisterPage && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">Đăng ký</Link>
                </Button>
              </>
            )}

            {/* Login Page => Show Register Button */}
            {isLoginPage && (
              <Button asChild>
                <Link to="/auth/register">Đăng ký</Link>
              </Button>
            )}

            {/* Register Page => Show Login Button */}
            {isRegisterPage && (
              <Button variant="ghost" asChild>
                <Link to="/auth/login">Đăng nhập</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
