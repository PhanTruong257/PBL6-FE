import { useQuery } from '@tanstack/react-query';
import { AuditLogsService } from '../api';
import type { AuditLogFilters } from '../types';

export function useAuditLogs(filters: AuditLogFilters) {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => AuditLogsService.getLogs(filters),
  });
}

export function useAuditLogById(logId: number | null) {
  return useQuery({
    queryKey: ['audit-log', logId],
    queryFn: () => AuditLogsService.getLogById(logId!),
    enabled: !!logId,
  });
}

export function useUserActivity(userId: number | null, limit?: number) {
  return useQuery({
    queryKey: ['user-activity', userId, limit],
    queryFn: () => AuditLogsService.getUserActivity(userId!, limit),
    enabled: !!userId,
  });
}
