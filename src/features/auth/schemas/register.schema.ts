import { z } from 'zod'

export const registerSchema = z
  .object({
    fullName: z.string().min(1).max(50),
    email: z.string().min(1).email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
