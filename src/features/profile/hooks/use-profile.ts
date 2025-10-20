import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileApi, type ProfileApiResponse, type UpdateProfileRequest } from '../api'
import { toast } from 'sonner'

export const PROFILE_QUERY_KEY = 'profile'

/**
 * Hook to get current user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: profileApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  })
}

/**
 * Hook to update profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (updatedProfile: ProfileApiResponse) => {
      // Update cache
      queryClient.setQueryData([PROFILE_QUERY_KEY], updatedProfile)
      
      // Show success message
      toast.success('Profile updated successfully!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    },
  })
}

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      currentPassword: string
      newPassword: string
      confirmPassword: string
    }) => profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password'
      toast.error(message)
    },
  })
}

/**
 * Hook to upload avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: (result) => {
      // Update profile cache with new avatar URL
      queryClient.setQueryData([PROFILE_QUERY_KEY], (oldData: ProfileApiResponse | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          avatar: result.avatarUrl,
        }
      })

      toast.success('Avatar uploaded successfully!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to upload avatar'
      toast.error(message)
    },
  })
}