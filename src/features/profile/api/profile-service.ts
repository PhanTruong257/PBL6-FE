import { httpClient } from '@/libs/http'
import type { IApiResponse } from '@/types/api'

export interface UpdateProfileRequest {
  full_name?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  avatar?: string
}

export interface ProfileApiResponse {
  user_id: number
  full_name: string
  email: string
  phone: string | null
  address: string | null
  dateOfBirth: string | null
  gender: string | null
  avatar: string | null
  role: string
  status: string
  created_at: string
  updated_at: string
}

export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ProfileApiResponse> => {
    const response = await httpClient.get<IApiResponse<ProfileApiResponse>>('/users/me')
    return response.data.data
  },

  /**
   * Update current user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<ProfileApiResponse> => {
    const response = await httpClient.put<IApiResponse<ProfileApiResponse>>('/users/me', data)
    return response.data.data
  },

  /**
   * Change password
   */
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<{ message: string }> => {
    const response = await httpClient.put<IApiResponse<{ message: string }>>('/users/change-password', data)
    return response.data.data
  },

  /**
   * Upload avatar (if API exists)
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await httpClient.post<IApiResponse<{ avatarUrl: string }>>('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  }
}