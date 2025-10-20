import { httpClient } from '@/libs/http'
import type { User } from '@/types/user'
import type { ApiResponse } from '@/types/api'

export interface UpdateProfileRequest {
  phone?: string
  dateOfBirth?: string
  address?: string
  gender?: string
}

export interface UpdateProfileResponse {
  user: User
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  message: string
}

/**
 * Profile Service - API calls for user profile management
 */
export const ProfileService = {
  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<ApiResponse<User>> {
    const response = await httpClient.get<ApiResponse<User>>('/users/profile')
    console.log('Get Current Profile response:', response.data);
    return response.data
  },

  /**
   * Update user profile
   */
  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UpdateProfileResponse>> {
    const response = await httpClient.patch<ApiResponse<UpdateProfileResponse>>(
      '/users/profile',
      data,
    )
    return response.data
  },

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await httpClient.post<ApiResponse<{ avatarUrl: string }>>(
      '/users/profile/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  },

  /**
   * Change password
   */
  async changePassword(
    data: ChangePasswordRequest,
  ): Promise<ApiResponse<ChangePasswordResponse>> {
    const response = await httpClient.put<ApiResponse<ChangePasswordResponse>>(
      '/users/change-password',
      data,
    )
    return response.data
  },
}
