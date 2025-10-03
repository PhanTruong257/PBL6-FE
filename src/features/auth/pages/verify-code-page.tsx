import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifyCodeForm } from '../components/verify-code-form'
import { AuthLayout } from '@/components/layout/auth-layout'

export function VerifyCodePage() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Xác thực mã
          </CardTitle>
          <CardDescription className="text-center">
            Nhập mã 6 số đã được gửi đến email của bạn
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <VerifyCodeForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
