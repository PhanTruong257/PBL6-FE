import { z } from 'zod'

export const createUserSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
  role: z.enum(['admin', 'teacher', 'user']),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

export const updateUserSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z.string().optional(),
  role: z.enum(['admin', 'teacher', 'user']).optional(),
  status: z.enum(['active', 'blocked']).optional(),
})

export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  gender: z.string().optional(),
  sortBy: z.enum(['full_name', 'email', 'created_at', 'role']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// Keep old schemas for backward compatibility if needed
export const createTeacherSchema = createUserSchema
export const updateTeacherSchema = updateUserSchema
export const teacherFiltersSchema = userFiltersSchema

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>
export type UserFiltersFormData = z.infer<typeof userFiltersSchema>

