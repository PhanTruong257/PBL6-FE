import { atom } from 'recoil'
import type { User } from '../../../types/user'

/**
 * Current user state.
 * Contains complete user data including roles and permissions from /users/me.
 * null = user not logged in or not yet loaded.
 */
export const currentUserState = atom<User | null>({
    key: 'currentUserState',
    default: null,
})
