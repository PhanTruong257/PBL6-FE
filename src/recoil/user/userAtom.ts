import { atom } from 'recoil'
import type { User } from '../../types/user'

export const usersState = atom<User[]>({
    key: 'usersState',
    default: [],
});