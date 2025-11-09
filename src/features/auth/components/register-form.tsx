import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/libs/toast'

import { useRegister, useAuthTranslation } from '../hooks'
import {
  registerSchema,
  type RegisterFormData,
} from '../schemas/register.schema'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { t } = useAuthTranslation()
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // Handle success/error with toast
  useEffect(() => {
    if (registerMutation.isSuccess) {
      toast.success(t('register.success'))
    }
  }, [registerMutation.isSuccess, t])

  useEffect(() => {
    if (registerMutation.isError) {
      const error = registerMutation.error as any
      const errorMessage = error?.response?.data?.message || t('register.error')
      toast.error(errorMessage)
    }
  }, [registerMutation.isError, registerMutation.error, t])

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">{t('register.fullName')}</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="full_name"
            placeholder={t('register.fullNamePlaceholder')}
            className="pl-9"
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-destructive">
            {errors.fullName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('register.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('register.emailPlaceholder')}
            className="pl-9"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t('register.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('register.passwordPlaceholder')}
            className="pl-9 pr-9"
            {...register('password')}
          />
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
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('register.confirmPassword')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('register.confirmPasswordPlaceholder')}
            className="pl-9 pr-9"
            {...register('confirmPassword')}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? t('register.submittingButton') : t('register.submitButton')}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('register.hasAccount')} </span>
        <Link to="/auth/login" className="text-primary hover:underline">
          {t('register.loginLink')}
        </Link>
      </div>

    </form>
  )
}
