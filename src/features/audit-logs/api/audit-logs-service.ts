import { httpClient } from '@/libs/http';
import type { AuditLog, AuditLogFilters, AuditLogsResponse, ApiResponse } from '../types';

export const AuditLogsService = {
  /**
   * Get audit logs with filters and pagination
   */
  async getLogs(filters: AuditLogFilters): Promise<ApiResponse<AuditLogsResponse>> {
    const response = await httpClient.get<ApiResponse<AuditLogsResponse>>('/audit-logs', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Get a single audit log by ID
   */
  async getLogById(logId: number): Promise<ApiResponse<AuditLog>> {
    const response = await httpClient.get<ApiResponse<AuditLog>>(`/audit-logs/${logId}`);
    return response.data;
  },

  /**
   * Get user activity history
   */
  async getUserActivity(userId: number, limit?: number): Promise<ApiResponse<AuditLog[]>> {
    const response = await httpClient.get<ApiResponse<AuditLog[]>>(`/audit-logs/user/${userId}`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Export audit logs
   */
  async exportLogs(filters: AuditLogFilters): Promise<ApiResponse<AuditLog[]>> {
    const response = await httpClient.get<ApiResponse<AuditLog[]>>('/audit-logs/export', {
      params: filters,
    });
    return response.data;
  },
};
