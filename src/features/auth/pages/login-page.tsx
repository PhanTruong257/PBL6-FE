import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '../components/login-form'
import { AuthLayout } from '@/components/layout/auth-layout'

export function LoginPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center">
            Nhập thông tin để truy cập hệ thống
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
