import { httpClient } from '@/libs/http'

export interface CreateClassRequest {
  class_name: string
  class_code: string
  description: string
  teacher_id: number
}

export interface CreateClassResponse {
  message: string
  class_name: string
  class_code: string
  description: string
}

/**
 * Auth Service - API calls for authentication
 */
export const ClassService = {
  /**
   * Login user
   */
  async CreateClass(
    data: CreateClassRequest,
  ): Promise<CreateClassResponse> {
    const response = await httpClient.post<CreateClassResponse>(
      '/classes/create',
      data,
    )
    return response.data
  },
}
