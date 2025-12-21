import { selector } from 'recoil'
import { authState } from '@/global/recoil/auth/auth-state'
import type { User } from '../../../types/user'

/**
 * Current user state.
 * Contains complete user data including roles and permissions from /users/me.
 * null = user not logged in or not yet loaded.
 */
export const currentUserState = selector<User | null>({
  key: 'currentUserState',
  get: ({ get }) => {
    const auth = get(authState)
    console.log('Current User:', auth.user)
    return auth.user
  },
})
