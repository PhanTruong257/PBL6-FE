import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/libs/toast'

import { useLogin, useAuthTranslation } from '../hooks'
import { loginSchema, type LoginFormData } from '../schemas/login.schema'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { t } = useAuthTranslation()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Handle success/error with toast
  useEffect(() => {
    if (loginMutation.isSuccess) {
      toast.success(t('login.success'))
    }
  }, [loginMutation.isSuccess, t])

  useEffect(() => {
    if (loginMutation.isError) {
      const error = loginMutation.error as any
      const errorMessage = error?.response?.data?.message || t('login.error')
      toast.error(errorMessage)
    }
  }, [loginMutation.isError, loginMutation.error, t])

  /**
   * Handle form submission.
   * On submit, trigger the login mutation with form data to call POST /auth/login API.
   */
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">{t('login.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('login.emailPlaceholder')}
            className="pl-9"
            {...register('email')}
          />
        </div>

        {/* Email Error Message */}
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">{t('login.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('login.passwordPlaceholder')}
            className="pl-9 pr-9"
            {...register('password')}
          />

          {/* Eye Icon Button => Hide/Show Password */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Password Error Message */}
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          {t('login.forgotPassword')}
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? t('login.submittingButton') : t('login.submitButton')}
      </Button>

      {/* Register Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('login.noAccount')} </span>
        <Link to="/auth/register" className="text-primary hover:underline">
          {t('login.registerLink')}
        </Link>
      </div>
    </form>
  )
}
