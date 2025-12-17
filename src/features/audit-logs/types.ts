/**
 * Audit Log Action Constants.
 */
export const AUDIT_LOG_ACTIONS = {
  // User actions
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DELETED: 'USER_DELETED',
  USER_BLOCKED: 'USER_BLOCKED',
  USER_UNBLOCKED: 'USER_UNBLOCKED',
  USER_STATUS_CHANGED: 'USER_STATUS_CHANGED',
  USER_PROFILE_UPDATED: 'USER_PROFILE_UPDATED',
  USER_PASSWORD_CHANGED: 'USER_PASSWORD_CHANGED',

  // Role actions
  ROLE_CREATED: 'ROLE_CREATED',
  ROLE_UPDATED: 'ROLE_UPDATED',
  ROLE_DELETED: 'ROLE_DELETED',
  ROLE_ASSIGNED_TO_USER: 'ROLE_ASSIGNED_TO_USER',
  ROLE_REMOVED_FROM_USER: 'ROLE_REMOVED_FROM_USER',

  // Permission actions
  PERMISSION_CREATED: 'PERMISSION_CREATED',
  PERMISSION_UPDATED: 'PERMISSION_UPDATED',
  PERMISSION_DELETED: 'PERMISSION_DELETED',
  PERMISSION_ASSIGNED_TO_ROLE: 'PERMISSION_ASSIGNED_TO_ROLE',
  PERMISSION_REMOVED_FROM_ROLE: 'PERMISSION_REMOVED_FROM_ROLE',
  PERMISSIONS_SYNCED: 'PERMISSIONS_SYNCED',
} as const;

export type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[keyof typeof AUDIT_LOG_ACTIONS];

export const AUDIT_LOG_RESOURCES = {
  USER: 'USER',
  ROLE: 'ROLE',
  PERMISSION: 'PERMISSION',
  USER_ROLE: 'USER_ROLE',
  ROLE_PERMISSION: 'ROLE_PERMISSION',
} as const;

export type AuditLogResource = (typeof AUDIT_LOG_RESOURCES)[keyof typeof AUDIT_LOG_RESOURCES];

export interface AuditLog {
  log_id: number;
  action: string;
  resource: AuditLogResource;
  description?: string;
  actor_id: number;
  actor_email: string;
  actor_name: string;
  target_id?: string;
  target_type?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  changes?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  request_method?: string;
  request_path?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  actor?: {
    user_id: number;
    full_name: string;
    email: string;
    avatar?: string;
  };
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  action?: string;
  resource?: AuditLogResource;
  actorId?: number;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
