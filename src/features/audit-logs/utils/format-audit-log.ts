import { AUDIT_LOG_ACTIONS, AUDIT_LOG_RESOURCES, type AuditLogResource } from '../types';

/**
 * Format action label for display
 */
export function formatActionLabel(action: string): string {
  const actionLabels: Record<string, string> = {
    [AUDIT_LOG_ACTIONS.USER_CREATED]: 'Tạo người dùng',
    [AUDIT_LOG_ACTIONS.USER_UPDATED]: 'Cập nhật người dùng',
    [AUDIT_LOG_ACTIONS.USER_DELETED]: 'Xóa người dùng',
    [AUDIT_LOG_ACTIONS.USER_BLOCKED]: 'Khóa người dùng',
    [AUDIT_LOG_ACTIONS.USER_UNBLOCKED]: 'Mở khóa người dùng',
    [AUDIT_LOG_ACTIONS.USER_STATUS_CHANGED]: 'Thay đổi trạng thái',
    [AUDIT_LOG_ACTIONS.USER_PROFILE_UPDATED]: 'Cập nhật hồ sơ',
    [AUDIT_LOG_ACTIONS.USER_PASSWORD_CHANGED]: 'Đổi mật khẩu',
    [AUDIT_LOG_ACTIONS.ROLE_CREATED]: 'Tạo vai trò',
    [AUDIT_LOG_ACTIONS.ROLE_UPDATED]: 'Cập nhật vai trò',
    [AUDIT_LOG_ACTIONS.ROLE_DELETED]: 'Xóa vai trò',
    [AUDIT_LOG_ACTIONS.ROLE_ASSIGNED_TO_USER]: 'Gán vai trò',
    [AUDIT_LOG_ACTIONS.ROLE_REMOVED_FROM_USER]: 'Xóa vai trò',
    [AUDIT_LOG_ACTIONS.PERMISSION_CREATED]: 'Tạo quyền',
    [AUDIT_LOG_ACTIONS.PERMISSION_UPDATED]: 'Cập nhật quyền',
    [AUDIT_LOG_ACTIONS.PERMISSION_DELETED]: 'Xóa quyền',
    [AUDIT_LOG_ACTIONS.PERMISSION_ASSIGNED_TO_ROLE]: 'Gán quyền',
    [AUDIT_LOG_ACTIONS.PERMISSION_REMOVED_FROM_ROLE]: 'Xóa quyền',
    [AUDIT_LOG_ACTIONS.PERMISSIONS_SYNCED]: 'Đồng bộ quyền',
  };
  return actionLabels[action] || action;
}

/**
 * Format resource label for display
 */
export function formatResourceLabel(resource: AuditLogResource): string {
  const resourceLabels: Record<string, string> = {
    [AUDIT_LOG_RESOURCES.USER]: 'Người dùng',
    [AUDIT_LOG_RESOURCES.ROLE]: 'Vai trò',
    [AUDIT_LOG_RESOURCES.PERMISSION]: 'Quyền hạn',
    [AUDIT_LOG_RESOURCES.USER_ROLE]: 'Vai trò người dùng',
    [AUDIT_LOG_RESOURCES.ROLE_PERMISSION]: 'Quyền vai trò',
  };
  return resourceLabels[resource] || resource;
}

/**
 * Get color variant for action type
 */
export function getActionColor(action: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (action.includes('CREATED')) return 'default';
  if (action.includes('DELETED') || action.includes('BLOCKED')) return 'destructive';
  if (action.includes('UPDATED') || action.includes('UNBLOCKED')) return 'secondary';
  return 'outline';
}

/**
 * Format date for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Get action options for filter dropdown
 */
export function getActionOptions() {
  return [
    { value: '', label: 'Tất cả hành động' },
    { value: AUDIT_LOG_ACTIONS.USER_CREATED, label: 'Tạo người dùng' },
    { value: AUDIT_LOG_ACTIONS.USER_UPDATED, label: 'Cập nhật người dùng' },
    { value: AUDIT_LOG_ACTIONS.USER_BLOCKED, label: 'Khóa người dùng' },
    { value: AUDIT_LOG_ACTIONS.USER_UNBLOCKED, label: 'Mở khóa người dùng' },
    { value: AUDIT_LOG_ACTIONS.USER_PROFILE_UPDATED, label: 'Cập nhật hồ sơ' },
    { value: AUDIT_LOG_ACTIONS.ROLE_CREATED, label: 'Tạo vai trò' },
    { value: AUDIT_LOG_ACTIONS.ROLE_UPDATED, label: 'Cập nhật vai trò' },
    { value: AUDIT_LOG_ACTIONS.ROLE_DELETED, label: 'Xóa vai trò' },
    { value: AUDIT_LOG_ACTIONS.PERMISSION_ASSIGNED_TO_ROLE, label: 'Gán quyền' },
  ];
}

/**
 * Get resource options for filter dropdown
 */
export function getResourceOptions() {
  return [
    { value: '', label: 'Tất cả tài nguyên' },
    { value: AUDIT_LOG_RESOURCES.USER, label: 'Người dùng' },
    { value: AUDIT_LOG_RESOURCES.ROLE, label: 'Vai trò' },
    { value: AUDIT_LOG_RESOURCES.PERMISSION, label: 'Quyền hạn' },
    { value: AUDIT_LOG_RESOURCES.USER_ROLE, label: 'Vai trò người dùng' },
    { value: AUDIT_LOG_RESOURCES.ROLE_PERMISSION, label: 'Quyền vai trò' },
  ];
}
