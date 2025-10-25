import { httpClient } from '@/libs/http'
import type { IApiResponse } from '@/types/api'
import type { User } from '@/types/user'

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
 * Updated to use httpClient with IApiResponse format
 */
export const ProfileService = {
  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<User> {
    const response = await httpClient.get<IApiResponse<User>>('/users/me')
    console.log('Get Current Profile result:', response.data)
    return response.data.data
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const response = await httpClient.patch<IApiResponse<UpdateProfileResponse>>('/users/me', data)
    return response.data.data
  },

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await httpClient.post<IApiResponse<{ avatarUrl: string }>>('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await httpClient.put<IApiResponse<ChangePasswordResponse>>('/users/change-password', data)
    return response.data.data
  },
}
