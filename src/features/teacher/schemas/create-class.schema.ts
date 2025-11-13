import { z } from 'zod'

export const createClassSchema = z.object({
  class_name: z
    .string()
    .min(1, 'Tên lớp là bắt buộc')
    .max(100, 'Tên lớp không được quá 100 ký tự')
    .trim(),
  class_code: z
    .string()
    .min(1, 'Mã lớp là bắt buộc')
    .max(50, 'Mã lớp không được quá 50 ký tự')
    .regex(
      /^[A-Z0-9_-]+$/i,
      'Mã lớp chỉ được chứa chữ cái, số, gạch ngang và gạch dưới',
    )
    .trim()
    .toUpperCase(),
  description: z
    .string()
    .max(500, 'Mô tả không được quá 500 ký tự')
    .optional()
    .or(z.literal('')),
  teacher_id: z.number().int().positive('Teacher ID phải là số dương'),
})

export type CreateClassForm = z.infer<typeof createClassSchema>
