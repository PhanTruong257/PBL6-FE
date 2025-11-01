import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ProfileService } from '../api'
import type { UpdateProfileRequest, ChangePasswordRequest } from '../api'
import { authKeys } from '@/features/auth/hooks/use-auth'
// import { tokenStorage } from '@/libs/utils'

/**
 * Query keys for React Query
 */
export const profileKeys = {
  all: ['profile'] as const,
  profile: () => [...profileKeys.all, 'current'] as const,
}

/**
 * Hook to get current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: profileKeys.profile(),
    queryFn: () => ProfileService.getCurrentProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Temporarily disable API call to prevent 401 redirects
  })
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => ProfileService.updateProfile(data),
    onSuccess: (response) => {
      // Update both profile and auth user cache
      queryClient.setQueryData(profileKeys.profile(), response)
      queryClient.setQueryData(authKeys.user(), response.user)

      // Invalidate to refetch
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() })
      queryClient.invalidateQueries({ queryKey: authKeys.user() })

      toast.success('Cập nhật thông tin thành công!')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.',
      )
    },
  })
}

/**
 * Hook to upload avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => ProfileService.uploadAvatar(file),
    onSuccess: () => {
      // Invalidate profile queries to refetch updated avatar
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() })
      queryClient.invalidateQueries({ queryKey: authKeys.user() })

      toast.success('Cập nhật ảnh đại diện thành công!')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.',
      )
    },
  })
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => ProfileService.changePassword(data),
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.',
      )
    },
  })
}
