import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '../components/register-form'
import { AuthLayout } from '@/components/layout/auth-layout'
import { useAuthTranslation } from '../hooks'

export function RegisterPage() {
  const { t } = useAuthTranslation()

  return (
    <AuthLayout>
      <Card className="w-full max-w-md animate-in fade-in-0 duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t('register.title')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('register.subtitle')}
          </CardDescription>
        </CardHeader>

        {/* Main Register Form Content */}
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
