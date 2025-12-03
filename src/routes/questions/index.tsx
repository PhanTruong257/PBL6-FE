import { createFileRoute, Navigate } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { QuestionsPage } from '@/features/questions'
import { useRecoilValue } from 'recoil'
import { currentUserState, userPermissionsSelector } from '@/global/recoil/user'
import { Loader2 } from 'lucide-react'

/**
 * Questions route - Accessible by users with 'view questions' permission
 */
export const Route = createFileRoute('/questions/' as any)({
  component: () => (
    <RequireAuth>
      <QuestionsPageRoute />
    </RequireAuth>
  ),
})

function QuestionsPageRoute() {
  const user = useRecoilValue(currentUserState)
  const userPermissions = useRecoilValue(userPermissionsSelector)
  
  console.log('Questions route - user:', user)
  console.log('Questions route - permissions:', userPermissions)

  // Wait for Recoil state to sync (RequireAuth ensures user exists, but Recoil might lag)
  if (!user) {
    console.log('⏳ Waiting for user data to sync to Recoil...')
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  console.log('Authenticated user:', user)
  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin'
  const canViewQuestions = userPermissions.some(
    p => p.resource === 'questions' && p.action === 'view'
  )

  return (
    <MainLayout>
      <QuestionsPage />
    </MainLayout>
  )
}