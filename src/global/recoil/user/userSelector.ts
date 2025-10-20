import { selector } from 'recoil'
import { currentUserState } from './userAtom'

/**
 * Selector to check if user is authenticated
 */
export const isAuthenticatedSelector = selector<boolean>({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => {
    const user = get(currentUserState)
    return user !== null
  },
})

/**
 * Selector to get user role
 */
export const userRoleSelector = selector<string | null>({
  key: 'userRoleSelector',
  get: ({ get }) => {
    const user = get(currentUserState)
    return user?.role || null
  },
})