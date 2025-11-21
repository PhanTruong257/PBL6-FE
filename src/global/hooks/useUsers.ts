import { useEffect, useCallback, useMemo } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  allUsersState,
  usersLoadingState,
  usersLastFetchState,
  shouldRefreshUsersSelector,
} from '@/global/recoil/users'
import { cookieStorage } from '@/libs/utils/cookie'
import type { User } from '@/types'

/**
 * Hook to fetch all users and cache in Recoil
 * Auto-refreshes if cache is older than 5 minutes
 */
export function useAllUsers(options?: { autoFetch?: boolean }) {
  const { autoFetch = true } = options || {}

  const [allUsers, setAllUsers] = useRecoilState(allUsersState)
  const [isLoading, setIsLoading] = useRecoilState(usersLoadingState)
  const setLastFetch = useSetRecoilState(usersLastFetchState)
  const shouldRefresh = useRecoilValue(shouldRefreshUsersSelector)

  const fetchAllUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = cookieStorage.getAccessToken()

      // Use /users/list endpoint with large limit to get all users
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/list?page=1&limit=10000`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.ok) {
        throw new Error('Failed to fetch all users')
      }

      const json = await res.json()
      const users: User[] = json.data?.users || []

      setAllUsers(users)
      setLastFetch(Date.now())

      console.log(`✅ [USERS_CACHE] Fetched ${users.length} users`)
      return users
    } catch (error) {
      console.error('❌ [USERS_CACHE] Error fetching users:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [setAllUsers, setIsLoading, setLastFetch])

  // Auto-fetch on mount if no data or cache expired
  useEffect(() => {
    if (autoFetch && (allUsers.length === 0 || shouldRefresh)) {
      console.log('🔄 [USERS_CACHE] Auto-fetching users...')
      fetchAllUsers()
    }
  }, [autoFetch, allUsers.length, shouldRefresh, fetchAllUsers])

  return {
    users: allUsers,
    isLoading,
    refetch: fetchAllUsers,
  }
}

/**
 * Hook to search users with client-side filtering
 */
export function useSearchUsers(searchPattern: string, excludeUserId?: number) {
  const allUsers = useRecoilValue(allUsersState)

  const filteredUsers = useMemo(() => {
    if (!searchPattern.trim()) {
      return []
    }

    const pattern = searchPattern.toLowerCase().trim()

    return allUsers.filter((user) => {
      // Exclude specific user if provided
      if (excludeUserId && user.user_id === excludeUserId) {
        return false
      }

      // Search in email
      if (user.email.toLowerCase().includes(pattern)) {
        return true
      }

      // Search in full_name
      if (user.full_name && user.full_name.toLowerCase().includes(pattern)) {
        return true
      }

      return false
    })
  }, [allUsers, searchPattern, excludeUserId])

  return {
    users: filteredUsers,
    totalUsers: allUsers.length,
  }
}
