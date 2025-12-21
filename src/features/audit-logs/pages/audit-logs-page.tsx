import { useState } from 'react'
import { History } from 'lucide-react'
import {
  AuditLogFiltersComponent,
  AuditLogTable,
  AuditLogDetailModal,
} from '../components'
import {
  useAuditLogs,
  useAuditLogFilters,
  useAuditLogsTranslation,
} from '../hooks'
import type { AuditLog } from '../types'
import { AuditLogsService } from '../apis'
import * as XLSX from 'xlsx'

export function AuditLogsPage() {
  // Translation hook
  const { t, i18n } = useAuditLogsTranslation()

  // State management
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Filters
  const { filters, updateFilters, resetFilters, setPage } = useAuditLogFilters()

  // API hooks
  const { data: logsData, isLoading } = useAuditLogs(filters)

  const logs = logsData?.data?.data || []
  const total = logsData?.data?.pagination?.total || 0
  const perPage = logsData?.data?.pagination?.limit || 20
  const currentPage = logsData?.data?.pagination?.page || 1

  // Event handlers
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await AuditLogsService.exportLogs(filters)
      const exportData = response.data

      // Transform data for export - use localized headers
      const exportRows = exportData.map((log) => ({
        ID: log.log_id,
        [t('table.timestamp')]: new Date(log.created_at).toLocaleString(
          i18n.language === 'vi' ? 'vi-VN' : 'en-US',
        ),
        [t('table.action')]: log.action,
        [t('table.resource')]: log.resource,
        [t('table.actor')]: log.actor_name,
        Email: log.actor_email,
        [t('details.description')]: log.description || '',
        'Target ID': log.target_id || '',
        [t('table.ipAddress')]: log.ip_address || '',
      }))

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportRows)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Audit Logs')

      // Generate filename with date
      const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`

      // Download
      XLSX.writeFile(wb, filename)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <History className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
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
  )
}
