import { atom } from 'recoil'
import type { User } from '../../../types/user'

export const usersState = atom<User | null>({
    key: 'usersState',
    default: null,
});