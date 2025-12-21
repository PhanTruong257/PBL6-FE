import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { AuditLog } from '../types'
import {
  formatActionLabel,
  formatResourceLabel,
  getActionColor,
  formatDateTime,
} from '../utils'
import { useAuditLogsTranslation } from '../hooks'

interface AuditLogTableProps {
  logs: AuditLog[]
  loading?: boolean
  onViewDetails: (log: AuditLog) => void
  itemsPerPage?: number
  total?: number
  onChangePage?: (page: number) => void
  currentPage?: number
}

export function AuditLogTable({
  logs,
  loading,
  onViewDetails,
  itemsPerPage = 20,
  total = 0,
  onChangePage,
  currentPage = 1,
}: AuditLogTableProps) {
  const { t } = useAuditLogsTranslation()

  // Calculate pagination
  const totalPages = Math.ceil(total / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, total)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.timestamp')}</TableHead>
              <TableHead>{t('table.action')}</TableHead>
              <TableHead>{t('table.resource')}</TableHead>
              <TableHead>{t('table.actor')}</TableHead>
              <TableHead>{t('details.description')}</TableHead>
              <TableHead>{t('table.ipAddress')}</TableHead>
              <TableHead className="w-[50px]">{t('table.details')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t('table.noData')}
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell className="font-mono text-sm whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getActionColor(log.action)}>
                      {formatActionLabel(log.action)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatResourceLabel(log.resource)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={log.actor?.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(log.actor_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">
                          {log.actor_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.actor_email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {log.description || '-'}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.ip_address || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {total > 0 && (
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {t('table.showing')} {startIndex + 1}-{endIndex} {t('table.of')}{' '}
            {total} {t('table.records')}
          </div>
          {totalPages > 1 && (
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        onChangePage &&
                        onChangePage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === 'ellipsis' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() =>
                            onChangePage && onChangePage(page as number)
                          }
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        onChangePage &&
                        onChangePage(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
