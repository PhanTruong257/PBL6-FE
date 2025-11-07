import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Copy, Check, ArrowLeft, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from '@/libs/toast'
import { useVerifyCode, useResendCode, useAuthTranslation } from '../hooks'
import { verifyCodeSchema, type VerifyCodeFormData } from '../schemas/verify-code.schema'
import { sessionStorage } from '@/libs/utils/session-storage'
import { OTPInput } from '@/components/ui/otp-input'

const RESEND_COOLDOWN = 60 // 60 seconds cooldown

export function VerifyCodeForm() {
  const navigate = useNavigate()
  const { t } = useAuthTranslation()
  const email = sessionStorage.get('temp_reset_email')
  const verifyCodeMutation = useVerifyCode()
  const resendCodeMutation = useResendCode()
  const [copiedCode, setCopiedCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      navigate({ to: '/auth/forgot-password' })
    }
  }, [email, navigate])

  const {
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: '',
    },
  })

  const codeValue = watch('code')

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Handle success/error with toast
  useEffect(() => {
    if (verifyCodeMutation.isSuccess) {
      toast.success(t('verifyCode.success'))
    }
  }, [verifyCodeMutation.isSuccess, t])

  useEffect(() => {
    if (verifyCodeMutation.isError) {
      const error = verifyCodeMutation.error as any
      const errorMessage = error?.response?.data?.message || t('verifyCode.error')
      toast.error(errorMessage)
    }
  }, [verifyCodeMutation.isError, verifyCodeMutation.error, t])

  useEffect(() => {
    if (resendCodeMutation.isSuccess) {
      toast.success(t('verifyCode.resendSuccess'))
      setCountdown(RESEND_COOLDOWN) // Start countdown
    }
  }, [resendCodeMutation.isSuccess, t])

  useEffect(() => {
    if (resendCodeMutation.isError) {
      const error = resendCodeMutation.error as any
      const errorMessage = error?.response?.data?.message || 'Không thể gửi lại mã'
      toast.error(errorMessage)
    }
  }, [resendCodeMutation.isError, resendCodeMutation.error])

  const onSubmit = (data: VerifyCodeFormData) => {
    if (!email) return

    verifyCodeMutation.mutate({
      email,
      code: data.code,
    })
  }

  const handleResend = () => {
    if (!email || countdown > 0) return

    resendCodeMutation.mutate({
      email,
    })
  }

  const handleCopyCode = async () => {
    if (codeValue && codeValue.length === 6) {
      try {
        await navigator.clipboard.writeText(codeValue)
        setCopiedCode(true)
        toast.success(t('verifyCode.copyCode'))
        setTimeout(() => setCopiedCode(false), 2000)
      } catch (err) {
        toast.error('Failed to copy code')
      }
    }
  }

  const handleBackToForgotPassword = () => {
    sessionStorage.remove('temp_reset_email')
    navigate({ to: '/auth/forgot-password' })
  }

  if (!email) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Info */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {t('verifyCode.codeSentTo')}
        </p>
        <p className="font-medium text-base">{email}</p>
      </div>

      {/* OTP Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="code" className="text-base font-semibold">
            {t('verifyCode.codeLabel')}
          </Label>
          {codeValue && codeValue.length === 6 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className="h-auto py-1 px-2 text-xs"
            >
              {copiedCode ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  <span>{t('verifyCode.copyCode')}</span>
                </>
              )}
            </Button>
          )}
        </div>
        
        <OTPInput
          value={codeValue}
          onChange={(value: string) => setValue('code', value, { shouldValidate: true })}
          length={6}
          disabled={verifyCodeMutation.isPending}
          error={!!errors.code}
        />
        
        {errors.code && (
          <p className="text-sm text-destructive text-center">{errors.code.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold"
        disabled={verifyCodeMutation.isPending || codeValue.length !== 6}
      >
        {verifyCodeMutation.isPending ? t('verifyCode.submittingButton') : t('verifyCode.submitButton')}
      </Button>

      {/* Resend Section - Prominent */}
      <div className="space-y-3 pt-4 border-t">
        <p className="text-center text-base font-medium text-foreground">
          {t('verifyCode.notReceived')}
        </p>
        
        <Button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resendCodeMutation.isPending}
          variant="outline"
          className="w-full h-11 text-base font-semibold"
        >
          {resendCodeMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 animate-spin" />
              {t('verifyCode.resendingButton')}
            </span>
          ) : countdown > 0 ? (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {`Gửi lại sau ${countdown}s`}
            </span>
          ) : (
            t('verifyCode.resendButton')
          )}
        </Button>
      </div>

      {/* Back to Forgot Password Link */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleBackToForgotPassword}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Quay lại nhập email
        </button>
      </div>
    </form>
  )
}
