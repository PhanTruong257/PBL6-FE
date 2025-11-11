import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().min(1).email(),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
