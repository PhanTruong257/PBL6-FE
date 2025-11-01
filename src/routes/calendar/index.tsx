import { createFileRoute } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import CalendarPage from '@/features/calendar/calendar-page'

export const Route = createFileRoute('/calendar/')({
  component: () => (
    <RequireAuth>
      <MainLayout>
        <CalendarPage />
      </MainLayout>
    </RequireAuth>
  ),
})