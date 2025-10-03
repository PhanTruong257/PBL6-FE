import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useResetPassword } from '@/features/auth/hooks/use-auth'
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/reset-password.schema'
import { tempStorage } from '@/libs/utils'

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const email = tempStorage.getResetEmail()
  const code = tempStorage.getResetCode()
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
      {resetPasswordMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>
            {resetPasswordMutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu mới</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Nhập mật khẩu mới"
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
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Nhập lại mật khẩu mới"
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
        {resetPasswordMutation.isPending ? 'Đang đặt lại mật khẩu...' : 'Đặt lại mật khẩu'}
      </Button>
    </form>
  )
}
