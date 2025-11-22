import { httpClient } from '@/libs/http'
import type { User } from '@/types'

export interface GetUsersRequest {
  page?: number
  limit?: number
}

export interface GetUsersResponse {
  data: {
    users: User[]
    total: number
    page: number
    limit: number
  }
}

export class UsersService {
  /**
   * Get all users with pagination
   */
  static async getUsers(
    params: GetUsersRequest = {},
  ): Promise<GetUsersResponse> {
    const { page = 1, limit = 10000 } = params
    const response = await httpClient.get('/users/list', {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: number): Promise<{ data: User }> {
    const response = await httpClient.get(`/users/${userId}`)
    return response.data
  }

  /**
   * Get users by IDs
   */
  static async getUsersByIds(
    userIds: number[],
  ): Promise<{ data: { users: User[] } }> {
    const response = await httpClient.post('/users/get-list-profile-by-ids', {
      userIds,
    })
    return response.data
  }

  /**
   * Get users by emails
   */
  static async getUsersByEmails(
    emails: string[],
  ): Promise<{ data: { users: User[] } }> {
    const response = await httpClient.post(
      '/users/get-list-profile-by-emails',
      {
        userEmails: emails,
      },
    )
    return response.data
  }
}
