import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import type { AuditLog } from '../types'
import {
  formatActionLabel,
  formatResourceLabel,
  getActionColor,
  formatDateTime,
} from '../utils'
import { DataChangeViewer } from './data-change-viewer'
import { useAuditLogsTranslation } from '../hooks'

interface AuditLogDetailModalProps {
  log: AuditLog | null
  onClose: () => void
}

export function AuditLogDetailModal({
  log,
  onClose,
}: AuditLogDetailModalProps) {
  const { t } = useAuditLogsTranslation()

  if (!log) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={!!log} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('details.title')} #{log.log_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('table.timestamp')}
              </label>
              <div className="mt-1 font-mono">
                {formatDateTime(log.created_at)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('table.action')}
              </label>
              <div className="mt-1">
                <Badge variant={getActionColor(log.action)}>
                  {formatActionLabel(log.action)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('table.resource')}
              </label>
              <div className="mt-1">
                <Badge variant="outline">
                  {formatResourceLabel(log.resource)}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('table.target')}
              </label>
              <div className="mt-1">{log.target_id || '-'}</div>
            </div>
          </div>

          <Separator />

          {/* Actor Info */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t('table.actor')}
            </label>
            <div className="mt-2 flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={log.actor?.avatar} />
                <AvatarFallback>{getInitials(log.actor_name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{log.actor_name}</div>
                <div className="text-sm text-muted-foreground">
                  {log.actor_email}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('table.ipAddress')}
              </label>
              <div className="mt-1 font-mono">{log.ip_address || '-'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('details.method')}
              </label>
              <div className="mt-1">{log.request_method || '-'}</div>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t('details.path')}
              </label>
              <div className="mt-1 font-mono text-sm">
                {log.request_path || '-'}
              </div>
            </div>
          </div>

          {/* Description */}
          {log.description && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('details.description')}
                </label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  {log.description}
                </div>
              </div>
            </>
          )}

          {/* Data Changes */}
          {(log.old_data || log.new_data) && (
            <>
              <Separator />
              <DataChangeViewer
                oldData={log.old_data}
                newData={log.new_data}
                changes={log.changes}
              />
            </>
          )}

          {/* User Agent */}
          {log.user_agent && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  User Agent
                </label>
                <div className="mt-1 text-xs font-mono p-2 bg-muted rounded-md break-all">
                  {log.user_agent}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
