import { createFileRoute } from '@tanstack/react-router'
import { ForgotPasswordForm } from '@/features/auth/forgot-password/components/forgot-password-form'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage
})

function ForgotPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  )
}