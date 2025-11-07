import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '../components/login-form'
import { AuthLayout } from '@/components/layout/auth-layout'
import { useAuthTranslation } from '../hooks'

export function LoginPage() {
  const { t } = useAuthTranslation()

  return (
    <AuthLayout>
      <Card className="w-full max-w-md animate-in fade-in-0 duration-300">
        {/* Card Header */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>

        {/* Main Login Form Content */}
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
