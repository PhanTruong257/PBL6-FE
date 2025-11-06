import { createFileRoute } from '@tanstack/react-router'
import { CreateClassPage } from '@/features/class/create-class'
import { RequireAuth } from '@/components/auth'
import { MainLayout } from '@/components/layout'

// export const Route = createFileRoute('/classes/create-class')({
//   component: () => (
//     <RequireAuth>
//       <MainLayout>
//         <CreateClassPage />
//       </MainLayout>
//     </RequireAuth>
//   ),
// })

export const Route = createFileRoute('/classes/create-class')({
  component: () => (

      <MainLayout>
        <CreateClassPage />
      </MainLayout>
  
  ),
})
