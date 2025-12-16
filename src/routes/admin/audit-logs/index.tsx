import { createFileRoute } from '@tanstack/react-router';
import { AuditLogsPage } from '@/features/audit-logs';
import { MainLayout } from '@/components/layout';
import { RequireAuth } from '@/components/auth';

export const Route = createFileRoute('/admin/audit-logs/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <AuditLogsPage />
      </MainLayout>
    </RequireAuth>
  ),
});
