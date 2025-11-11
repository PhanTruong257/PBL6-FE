import { createFileRoute, Navigate } from '@tanstack/react-router'
import { RequireAuth } from '@/components/auth/require-auth'
import { MainLayout } from '@/components/layout/main-layout'
import { QuestionsPage } from '@/features/questions'
import { useRecoilValue } from 'recoil'
import { currentUserState, userPermissionsSelector } from '@/global/recoil/user'

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

  // Check if user is authenticated
  if (!user) {
    console.log('No user - redirecting to login')
    return <Navigate to='/auth/login' />
  }

  const isTeacherOrAdmin = user.role === 'teacher' || user.role === 'admin'
  const canViewQuestions = userPermissions.some(
    p => p.resource === 'questions' && p.action === 'view'
  )
  
  if (!isTeacherOrAdmin || !canViewQuestions) {
    console.log('Access denied - role:', user.role, 'hasPermission:', canViewQuestions)
    return <Navigate to='/dashboard' />
  }

  return (
    <MainLayout>
      <QuestionsPage />
    </MainLayout>
  )
}