import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '../components/register-form'
import { AuthLayout } from '@/components/layout/auth-layout'

export function RegisterPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để bắt đầu học tập
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
