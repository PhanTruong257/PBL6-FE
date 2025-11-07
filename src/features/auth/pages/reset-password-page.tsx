import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResetPasswordForm } from '../components/reset-password-form'
import { AuthLayout } from '@/components/layout/auth-layout'
import { useAuthTranslation } from '../hooks'

export function ResetPasswordPage() {
  const { t } = useAuthTranslation()

  return (
    <AuthLayout>
      <Card className="w-full max-w-md animate-in fade-in-0 duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('resetPassword.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('resetPassword.subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
