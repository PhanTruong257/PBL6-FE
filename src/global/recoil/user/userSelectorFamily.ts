import { selector } from 'recoil'
import { currentUserState } from './userAtom'
import type { Permission } from '../../../types/user'

/**
 * Selector to get user permissions
 */
export const userPermissionsSelector = selector<Permission[]>({
  key: 'userPermissionsSelector',
  get: ({ get }) => {
    const user = get(currentUserState)
    return user?.permissions || []
  },
})
