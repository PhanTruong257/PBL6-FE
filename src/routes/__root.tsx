import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { AuthService } from '@/features/auth'
import { currentUserState } from '@/global/recoil/user'
import { cookieStorage } from '@/libs/utils'
import { useRef, useEffect } from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import {
  useGlobalConversationSync,
  useMessageNotifications,
} from '@/features/conversation/hooks'
import { useClassNotifications } from '@/features/class/detail-class/hooks'

export interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const setUser = useSetRecoilState(currentUserState)
  const currentUser = useRecoilValue(currentUserState)
  const hasLoadedUser = useRef(false)

  // Global conversation sync - always active regardless of route
  useGlobalConversationSync(currentUser?.user_id)

  // Message notifications - show popup for new messages
  useMessageNotifications({ userId: currentUser?.user_id })

  // Class notifications - show popup for new posts and replies
  // Automatically joins all user's classes to receive notifications globally
  useClassNotifications({
    userId: currentUser?.user_id,
    userRole: currentUser?.role,
  })

  // Auto-load user data ONCE on app initialization/reload
  useEffect(() => {
    // Prevent duplicate calls
    if (hasLoadedUser.current) {
      return
    }

    const loadUserData = async () => {
      const accessToken = cookieStorage.getAccessToken()

      if (!accessToken) {
        console.log('⚠️ No access token found, skipping user data load')
        hasLoadedUser.current = true
        return
      }

      try {
        console.log('🔄 Loading user data from /users/me...')
        const response = await AuthService.getCurrentUser()
        const userData = response.data

        // Update Recoil state with complete user data (includes roles & permissions)
        setUser(userData)

        console.log(`✅ User data loaded: ${userData.email}`)
        console.log(
          `✅ Loaded ${userData.roles?.length || 0} roles and ${userData.permissions?.length || 0} permissions`,
        )

        hasLoadedUser.current = true
      } catch (error: any) {
        console.error('❌ Failed to load user data:', error)

        // If 401 Unauthorized, clear tokens
        if (error?.response?.status === 401) {
          console.log('🔓 Invalid token, clearing authentication')
          cookieStorage.clearTokens()
          setUser(null)
        }

        hasLoadedUser.current = true
      }
    }

    loadUserData()
  }, [setUser])

  return (
    <>
      <Outlet />
    </>
  )
}
