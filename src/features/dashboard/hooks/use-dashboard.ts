import { useRecoilValue } from 'recoil'
import { currentUserState } from '@/global/recoil/user'

export function useDashboard() {
    const user = useRecoilValue(currentUserState)

    const getRoleBasedRedirect = () => {
        if (!user) return null

        switch (user.role) {
            case 'admin':
                return '/admin/dashboard'
            case 'teacher':
                return '/teacher/dashboard'
            default:
                return '/dashboard'
        }
    }

    const getRoleDisplayName = () => {
        if (!user) return ''

        switch (user.role) {
            case 'admin':
                return 'Quản trị viên'
            case 'teacher':
                return 'Giáo viên'
            default:
                return 'Học viên'
        }
    }

    return {
        user,
        isLoading: !user,
        getRoleBasedRedirect,
        getRoleDisplayName,
    }
}