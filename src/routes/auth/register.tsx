import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '@/features/auth/pages'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})