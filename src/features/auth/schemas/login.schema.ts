import z from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
