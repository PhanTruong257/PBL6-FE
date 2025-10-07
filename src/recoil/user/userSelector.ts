import { selector } from 'recoil';
import { usersState } from './userAtom';

export const totalUserSelector = selector<number>({
    key: 'totalUserSelector',
    get: ({ get }) => {
        const users = get(usersState);
        return users.length;
    }
})