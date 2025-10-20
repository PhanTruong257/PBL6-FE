import { z } from 'zod'

/**
 * Profile update schema
 */
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .optional(),
  
  phone: z
    .string()
    .regex(/^[+]?[0-9\s-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .optional()
    .or(z.literal('')),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  
  gender: z
    .enum(['male', 'female', 'other'])
    .optional()
    .or(z.literal('')),
  
  avatar: z
    .string()
    .url('Avatar must be a valid URL')
    .optional()
    .or(z.literal('')),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>