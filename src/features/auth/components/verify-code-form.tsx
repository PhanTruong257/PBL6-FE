import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { KeyRound } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useVerifyCode, useResendCode } from '@/features/auth/hooks/use-auth'
import { verifyCodeSchema, type VerifyCodeFormData } from '../schemas/verify-code.schema'
import { sessionStorage } from '@/libs/utils/session-storage'

export function VerifyCodeForm() {
  const navigate = useNavigate()
  const email = sessionStorage.get('temp_reset_email')
  const verifyCodeMutation = useVerifyCode()
  const resendCodeMutation = useResendCode()

  // Redirect if no email found
  useEffect(() => {
    if (!email) {
      navigate({ to: '/auth/forgot-password' })
    }
  }, [email, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
  })

  const onSubmit = (data: VerifyCodeFormData) => {
    if (!email) return

    verifyCodeMutation.mutate({
      email,
      code: data.code,
    })
  }

  const handleResend = () => {
    if (!email) return

    resendCodeMutation.mutate({
      email,
    })
  }

  if (!email) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {verifyCodeMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {verifyCodeMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      {resendCodeMutation.isSuccess && (
        <Alert>
          <AlertDescription>
            Mã xác thực mới đã được gửi đến email của bạn!
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          Nhập mã 6 số đã được gửi đến
        </p>
        <p className="font-medium">{email}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Mã xác thực</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="000000"
            className="pl-9 text-center text-2xl tracking-widest"
            {...register('code')}
          />
        </div>
        {errors.code && (
          <p className="text-sm text-destructive">{errors.code.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={verifyCodeMutation.isPending}
      >
        {verifyCodeMutation.isPending ? 'Đang xác thực...' : 'Xác thực'}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Không nhận được mã? </span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCodeMutation.isPending}
          className="text-primary hover:underline disabled:opacity-50"
        >
          {resendCodeMutation.isPending ? 'Đang gửi...' : 'Gửi lại'}
        </button>
      </div>
    </form>
  )
}
