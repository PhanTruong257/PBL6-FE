import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Create a schema for the OTP form
const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits'),
})

type FormValues = z.infer<typeof otpSchema>

export function OtpForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  
  // This would come from the query parameters in a real implementation
  const email = "user@example.com"

  const form = useForm<FormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  async function onSubmit() {
    setIsLoading(true)

    try {
      // Simulate OTP verification for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(t('auth.otpVerified'))
      navigate({ to: "/auth/sign-in" })
    } catch (error) {
      toast.error(t('auth.otpVerificationFailed'))
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const startResendCooldown = () => {
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          clearInterval(interval)
          return 0
        }
        return current - 1
      })
    }, 1000)
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error(t('auth.emailRequired'))
      return
    }

    try {
      // Would call the forgot password endpoint to resend the code
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(t('auth.otpResent'))
      startResendCooldown()
    } catch (error) {
      toast.error(t('auth.otpResendFailed'))
      console.error(error)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{t('auth.verificationCode')}</FormLabel>
                <FormControl>
                  {/* Using standard input instead of specialized OTP input */}
                  <Input
                    {...field}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? t('auth.verifying') : t('auth.verifyOtp')}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        {resendCooldown > 0 ? (
          <p className="text-muted-foreground">
            {t('auth.resendIn', { seconds: resendCooldown })}
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="font-medium text-primary hover:underline"
            disabled={isLoading}
          >
            {isLoading ? t('auth.sending') : t('auth.resendOtp')}
          </button>
        )}
      </div>

      <div className="text-center text-sm">
        <Link
          to="/auth/sign-in"
          className="font-medium text-primary hover:underline"
        >
          {t('auth.backToSignIn')}
        </Link>
      </div>
    </div>
  )
}