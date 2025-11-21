import { atom, selector } from 'recoil'
import type { User } from '@/types'

/**
 * All users cache - fetched once and stored
 */
export const allUsersState = atom<User[]>({
  key: 'allUsersState',
  default: [],
})

/**
 * Loading state for users fetch
 */
export const usersLoadingState = atom<boolean>({
  key: 'usersLoadingState',
  default: false,
})

/**
 * Last fetch timestamp
 */
export const usersLastFetchState = atom<number>({
  key: 'usersLastFetchState',
  default: 0,
})

/**
 * Selector to search users by name or email (client-side)
 */
export const searchUsersSelector = (
  searchPattern: string,
  excludeUserId?: number,
) =>
  selector({
    key: `searchUsers_${searchPattern}_${excludeUserId}`,
    get: ({ get }) => {
      const allUsers = get(allUsersState)

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
    },
  })

/**
 * Selector to check if users need refresh (cache older than 5 minutes)
 */
export const shouldRefreshUsersSelector = selector({
  key: 'shouldRefreshUsersSelector',
  get: ({ get }) => {
    const lastFetch = get(usersLastFetchState)
    const now = Date.now()
    const FIVE_MINUTES = 5 * 60 * 1000

    return now - lastFetch > FIVE_MINUTES
  },
})
