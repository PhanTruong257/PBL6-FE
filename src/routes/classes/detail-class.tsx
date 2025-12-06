import { createFileRoute } from '@tanstack/react-router'
import { ClassDetailPage } from '@/features/class'
import { MainLayout } from '@/components/layout'
import { z } from 'zod'

// Define search params validation
const classDetailSearchSchema = z.object({
  id: z.number().or(z.string()).optional(),
})

export const Route = createFileRoute('/classes/detail-class')({
  validateSearch: classDetailSearchSchema,
  component: () => (
    <MainLayout>
      <div className="h-full overflow-hidden">
        <ClassDetailPage />
      </div>
    </MainLayout>
  ),
})
