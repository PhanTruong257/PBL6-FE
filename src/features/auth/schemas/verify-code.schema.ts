import { z } from 'zod'

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .min(1)
    .length(6)
    .regex(/^\d+$/, 'Mã xác thực chỉ được chứa số'),
})

export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>
