import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { cookieStorage } from '@/libs/utils/cookie'
import { AuthService } from '@/features/auth/api/auth-service'
import { currentUserState } from '@/global/recoil/user'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const setUser = useSetRecoilState(currentUserState)

  // Auto-load user data on app initialization/reload
  useEffect(() => {
    const loadUserData = async () => {
      const accessToken = cookieStorage.getAccessToken()
      
      if (!accessToken) {
        console.log('⚠️ No access token found, skipping user data load')
        return
      }

      try {
        console.log('🔄 Loading user data from /users/me...')
        const response = await AuthService.getCurrentUser()
        const userData = response.data
        
        // Update Recoil state with complete user data (includes roles & permissions)
        setUser(userData)
        
        console.log(`✅ User data loaded: ${userData.email}`)
        console.log(`✅ Loaded ${userData.roles?.length || 0} roles and ${userData.permissions?.length || 0} permissions`)
      } catch (error: any) {
        console.error('❌ Failed to load user data:', error)
        
        // If 401 Unauthorized, clear tokens
        if (error?.response?.status === 401) {
          console.log('🔓 Invalid token, clearing authentication')
          cookieStorage.clearTokens()
          setUser(null)
        }
      }
    }

    loadUserData()
  }, [setUser])

  return (
    <>
      {/* <Header /> */}
      <Outlet />
      <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
    </>
  )
}
