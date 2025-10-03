import { z } from 'zod'

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(6, 'Mã xác thực phải có 6 ký tự')
    .max(6, 'Mã xác thực phải có 6 ký tự')
    .regex(/^\d+$/, 'Mã xác thực chỉ chứa số'),
})

export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>
