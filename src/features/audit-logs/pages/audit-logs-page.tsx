import { useState } from 'react';
import { History } from 'lucide-react';
import {
  AuditLogFiltersComponent,
  AuditLogTable,
  AuditLogDetailModal,
} from '../components';
import { useAuditLogs, useAuditLogFilters } from '../hooks';
import type { AuditLog } from '../types';
import { AuditLogsService } from '../api';
import * as XLSX from 'xlsx';

export function AuditLogsPage() {
  // State management
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filters
  const { filters, updateFilters, resetFilters, setPage } = useAuditLogFilters();

  // API hooks
  const { data: logsData, isLoading } = useAuditLogs(filters);

  const logs = logsData?.data?.data || [];
  const total = logsData?.data?.pagination?.total || 0;
  const perPage = logsData?.data?.pagination?.limit || 20;
  const currentPage = logsData?.data?.pagination?.page || 1;

  // Event handlers
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await AuditLogsService.exportLogs(filters);
      const exportData = response.data || [];

      // Transform data for export
      const exportRows = exportData.map((log) => ({
        ID: log.log_id,
        'Thời gian': new Date(log.created_at).toLocaleString('vi-VN'),
        'Hành động': log.action,
        'Tài nguyên': log.resource,
        'Người thực hiện': log.actor_name,
        Email: log.actor_email,
        'Mô tả': log.description || '',
        'Target ID': log.target_id || '',
        'IP': log.ip_address || '',
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs');

      // Generate filename with date
      const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <History className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhật ký hoạt động</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi tất cả các thay đổi trong hệ thống quản lý người dùng, vai trò và quyền hạn
          </p>
        </div>
      </div>

      {/* Filters */}
      <AuditLogFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Logs Table */}
      <AuditLogTable
        logs={logs}
        total={total}
        itemsPerPage={perPage}
        loading={isLoading}
        currentPage={currentPage}
        onChangePage={setPage}
        onViewDetails={handleViewDetails}
      />

      {/* Detail Modal */}
      <AuditLogDetailModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
