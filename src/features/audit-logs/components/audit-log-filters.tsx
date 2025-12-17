import { Search, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { AuditLogFilters, AuditLogResource } from '../types';
import { getActionOptions, getResourceOptions } from '../utils';

interface AuditLogFiltersProps {
  filters: AuditLogFilters;
  onFiltersChange: (filters: Partial<AuditLogFilters>) => void;
  onReset: () => void;
  onExport?: () => void;
  isExporting?: boolean;
}

export function AuditLogFiltersComponent({
  filters,
  onFiltersChange,
  onReset,
  onExport,
  isExporting,
}: AuditLogFiltersProps) {
  const actionOptions = getActionOptions();
  const resourceOptions = getResourceOptions();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              className="pl-9"
            />
          </div>

          {/* Action Filter */}
          <Select
            value={filters.action || ''}
            onValueChange={(value) => onFiltersChange({ action: value || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn hành động" />
            </SelectTrigger>
            <SelectContent>
              {actionOptions.map((option) => (
                <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Resource Filter */}
          <Select
            value={filters.resource || ''}
            onValueChange={(value) =>
              onFiltersChange({ resource: (value || undefined) as AuditLogResource | undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn tài nguyên" />
            </SelectTrigger>
            <SelectContent>
              {resourceOptions.map((option) => (
                <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Start Date */}
          <Input
            type="date"
            placeholder="Từ ngày"
            value={filters.startDate || ''}
            onChange={(e) => onFiltersChange({ startDate: e.target.value || undefined })}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            {/* End Date */}
            <Input
              type="date"
              placeholder="Đến ngày"
              value={filters.endDate || ''}
              onChange={(e) => onFiltersChange({ endDate: e.target.value || undefined })}
              className="w-[180px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onReset} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Đặt lại
            </Button>
            {onExport && (
              <Button
                variant="outline"
                onClick={onExport}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Đang xuất...' : 'Xuất Excel'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
