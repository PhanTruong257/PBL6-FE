import { useState, useCallback } from 'react';
import type { AuditLogFilters } from '../types';

const initialFilters: AuditLogFilters = {
  page: 1,
  limit: 20,
};

export function useAuditLogFilters() {
  const [filters, setFilters] = useState<AuditLogFilters>(initialFilters);

  const updateFilters = useCallback((newFilters: Partial<AuditLogFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when explicitly changing page)
      page: 'page' in newFilters ? newFilters.page : 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    setPage,
  };
}
