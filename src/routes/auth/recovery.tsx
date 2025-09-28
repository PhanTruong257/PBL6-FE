import { createFileRoute } from '@tanstack/react-router'
import { OtpForm } from '@/features/auth/otp/components/otp-form'

export const Route = createFileRoute('/auth/recovery')({
  component: OtpPage
})

function OtpPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Account Recovery</h1>
        <p className="text-sm text-muted-foreground">
          Enter the verification code sent to your email
        </p>
      </div>
      <OtpForm />
    </>
  )
}