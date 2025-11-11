import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Mail, ArrowLeft, Copy, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/libs/toast'
import { useForgotPassword, useAuthTranslation } from '../hooks'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/forgot-password.schema'

export function ForgotPasswordForm() {
  const { t } = useAuthTranslation()
  const forgotPasswordMutation = useForgotPassword()
  const [copiedEmail, setCopiedEmail] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const emailValue = watch('email')

  // Handle success/error with toast
  useEffect(() => {
    if (forgotPasswordMutation.isSuccess) {
      toast.success(t('forgotPassword.success'))
    }
  }, [forgotPasswordMutation.isSuccess, t])

  useEffect(() => {
    if (forgotPasswordMutation.isError) {
      const error = forgotPasswordMutation.error as any
      const errorMessage = error?.response?.data?.message || t('forgotPassword.error')
      toast.error(errorMessage)
    }
  }, [forgotPasswordMutation.isError, forgotPasswordMutation.error, t])

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data)
  }

  const handleCopyEmail = async () => {
    if (emailValue) {
      try {
        await navigator.clipboard.writeText(emailValue)
        setCopiedEmail(true)
        toast.success(t('forgotPassword.copyEmail'))
        setTimeout(() => setCopiedEmail(false), 2000)
      } catch (err) {
        toast.error('Failed to copy email')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('forgotPassword.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={t('forgotPassword.emailPlaceholder')}
            className="pl-9 pr-20"
            {...register('email')}
          />
          {emailValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={handleCopyEmail}
            >
              {copiedEmail ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={forgotPasswordMutation.isPending}
      >
        {forgotPasswordMutation.isPending ? t('forgotPassword.submittingButton') : t('forgotPassword.submitButton')}
      </Button>

      <div className="text-center text-sm">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('forgotPassword.backToLogin')}
        </Link>
      </div>
    </form>
  )
}
