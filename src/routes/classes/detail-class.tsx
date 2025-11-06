import { createFileRoute } from '@tanstack/react-router'
import { ClassDetailPage } from '@/features/class'
import { RequireAuth } from '@/components/auth'
import { MainLayout } from '@/components/layout'

// export const Route = createFileRoute('/classes/detail-class')({
//   component: () => (
//     < RequireAuth >
//       <MainLayout>
//         <ClassDetailPage />
//       </MainLayout>
//     </RequireAuth>
//   ),
// })

export const Route = createFileRoute('/classes/detail-class')({
  component: () => (

    <MainLayout>
      <ClassDetailPage />
    </MainLayout>

  ),
})

