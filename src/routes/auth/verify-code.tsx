import { createFileRoute } from '@tanstack/react-router'
import { VerifyCodePage } from '@/features/auth/pages'

export const Route = createFileRoute('/auth/verify-code')({
  component: VerifyCodePage,
})
