import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggler'
import { Link, useRouter } from '@tanstack/react-router'

export function AuthHeader() {
  const router = useRouter()
  const currentPath = router.state.location.pathname

  // Kiểm tra trang hiện tại
  const isLoginPage = currentPath === '/auth/login'
  const isRegisterPage = currentPath === '/auth/register'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="PBL6 Logo" 
            className="h-10 w-10 object-contain"
          />
          <span className="hidden font-bold text-lg sm:inline-block">
            PBL6 Learning
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Show buttons based on current page */}
          {!isLoginPage && !isRegisterPage && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/login">
                  Đăng nhập
                </Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">
                  Đăng ký
                </Link>
              </Button>
            </>
          )}

          {isLoginPage && (
            <Button asChild>
              <Link to="/auth/register">
                Đăng ký
              </Link>
            </Button>
          )}

          {isRegisterPage && (
            <Button variant="ghost" asChild>
              <Link to="/auth/login">
                Đăng nhập
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}