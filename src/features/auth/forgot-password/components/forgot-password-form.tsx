import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '@/utils/schemas/auth'

type FormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true)
      // Implementation for password reset would go here
      console.log("Resetting password for:", data.email)
      
      // Simulate success
      setEmailSent(true)
      toast.success(t('auth.resetLinkSent'))
    } catch (error) {
      toast.error(t('auth.resetLinkFailed'))
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex flex-col space-y-4 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3 text-green-500 dark:bg-green-800/20 dark:text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{t('auth.checkYourEmail')}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t('auth.resetEmailSent')}
          </p>
        </div>
        <div className="flex justify-center">
          <Link to="/auth/sign-in" className="text-sm underline">
            {t('auth.backToSignIn')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.emailAddress')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('auth.emailPlaceholder')}
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
          </Button>
        </form>
      </Form>
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