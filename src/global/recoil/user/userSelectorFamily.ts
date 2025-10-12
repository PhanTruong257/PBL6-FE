import { selectorFamily } from 'recoil';
import { usersState } from './userAtom';
import type { User } from '../../../types/user'

export const userSelector = selectorFamily<User, string>({
    key: 'userSelector',
    get: (id: string) => ({ get }) => {
        const users = get(usersState);
        return users.find((u) => u.user_id === id)!;
    },
});
