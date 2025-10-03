import z from 'zod'

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
      .max(100, 'Mật khẩu không được quá 100 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
