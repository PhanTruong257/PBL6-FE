import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ForgotPasswordForm } from '../components/forgot-password-form'
import { AuthLayout } from '@/components/layout/auth-layout'

export function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Quên mật khẩu
          </CardTitle>
          <CardDescription className="text-center">
            Nhập email để nhận mã xác thực
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
