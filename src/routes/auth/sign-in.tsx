import { createFileRoute } from '@tanstack/react-router'
import { SignInForm } from '@/features/auth/sign-in/components/sign-in-form'

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage
})

function SignInPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      <SignInForm />
    </>
  )
}