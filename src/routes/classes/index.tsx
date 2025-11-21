import { RequireAuth } from '@/components/auth'
import { MainLayout } from '@/components/layout'
import { MyClassesPage } from '@/features/class/my-classes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/classes/')({
  component: () => (
     <RequireAuth>
       <MainLayout>
         <MyClassesPage />
       </MainLayout>
     </RequireAuth>
   ),
})

 
