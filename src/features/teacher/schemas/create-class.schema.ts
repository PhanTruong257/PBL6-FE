import { z } from 'zod'

export const createClassSchema = z.object({
    class_name: z
        .string()
        .min(1, 'Tên lớp là bắt buộc')
        .max(50, 'Tên lớp không được quá 50 ký tự'),
    class_code: z
        .string()
        .min(1, 'Mã lớp là bắt buộc')
        .max(50, 'Mã lớp không được quá 50 ký tự'),
    description: z
        .string()
        .min(6, 'Mô tả phải có ít nhất 6 ký tự')
        .max(100, 'Mô tả không được quá 100 ký tự'),
    teacher_id: z
        .number()
        .min(1, 'Vui lòng chọn giáo viên'),
})

export type CreateClassForm = z.infer<typeof createClassSchema>
