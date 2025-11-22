import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UsersService } from '@/global/api/users-service'

// Query keys
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...usersKeys.lists(), { filters }] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
}

/**
 * Hook to fetch all users with React Query caching
 * Auto-refreshes based on staleTime configuration
 */
export function useAllUsers(options?: { enabled?: boolean }) {
  const { enabled = true } = options || {}

  const query = useQuery({
    queryKey: usersKeys.list({ page: 1, limit: 10000 }),
    queryFn: () => UsersService.getUsers({ page: 1, limit: 10000 }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })

  return {
    users: query.data?.data?.users || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Hook to search users with client-side filtering
 */
export function useSearchUsers(searchPattern: string, excludeUserId?: number) {
  const { users: allUsers } = useAllUsers()

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

/**
 * Hook to get user by ID
 */
export function useUser(userId: number, enabled = true) {
  return useQuery({
    queryKey: usersKeys.detail(userId),
    queryFn: () => UsersService.getUserById(userId),
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
