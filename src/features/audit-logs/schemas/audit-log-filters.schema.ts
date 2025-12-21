import { z } from 'zod';
import { AUDIT_LOG_RESOURCES } from '../types';

/**
 * Schema for audit log filters
 * Used for validating filter form data
 */
export const auditLogFiltersSchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  resource: z.enum([
    AUDIT_LOG_RESOURCES.USER,
    AUDIT_LOG_RESOURCES.ROLE,
    AUDIT_LOG_RESOURCES.PERMISSION,
    AUDIT_LOG_RESOURCES.USER_ROLE,
    AUDIT_LOG_RESOURCES.ROLE_PERMISSION,
  ] as const).optional(),
  actorId: z.number().optional(),
  targetId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Type inference from schema
 */
export type AuditLogFiltersFormData = z.infer<typeof auditLogFiltersSchema>;

/**
 * Schema for date range filter
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type DateRangeFormData = z.infer<typeof dateRangeSchema>;
