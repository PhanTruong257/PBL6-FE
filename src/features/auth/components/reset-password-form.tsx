import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/libs/toast'
import { useResetPassword, useAuthTranslation } from '../hooks'
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/reset-password.schema'
import { sessionStorage } from '@/libs/utils/session-storage'

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { t } = useAuthTranslation()
  const email = sessionStorage.get('temp_reset_email')
  const code = sessionStorage.get('temp_reset_code')
  const resetPasswordMutation = useResetPassword()

  // Redirect if no email or code found
  useEffect(() => {
    if (!email || !code) {
      navigate({ to: '/auth/forgot-password' })
    }
  }, [email, code, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Handle success/error with toast
  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      toast.success(t('resetPassword.success'))
    }
  }, [resetPasswordMutation.isSuccess, t])

  useEffect(() => {
    if (resetPasswordMutation.isError) {
      const error = resetPasswordMutation.error as any
      const errorMessage = error?.response?.data?.message || t('resetPassword.error')
      toast.error(errorMessage)
    }
  }, [resetPasswordMutation.isError, resetPasswordMutation.error, t])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!email || !code) return

    resetPasswordMutation.mutate({
      email,
      code,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
  }

  if (!email || !code) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">{t('resetPassword.newPassword')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('resetPassword.newPasswordPlaceholder')}
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
        <Label htmlFor="confirmPassword">{t('resetPassword.confirmPassword')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('resetPassword.confirmPasswordPlaceholder')}
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
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={resetPasswordMutation.isPending}
      >
        {resetPasswordMutation.isPending ? t('resetPassword.submittingButton') : t('resetPassword.submitButton')}
      </Button>
    </form>
  )
}
