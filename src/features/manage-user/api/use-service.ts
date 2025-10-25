import { httpClient } from "@/libs/http"
import type { UserFilters, UserResponse } from "../types"

export const UserService = {
    async getUsers(
      filters: UserFilters,
    ): Promise<UserResponse> {
      const response = await httpClient.get<UserResponse>('/users/list', {
        params: filters,
      })
      return response.data
    },

    async createUser(data: FormData): Promise<void> {
      await httpClient.post('/users/create', data)
    },

    async updateUser(id: string, data: FormData): Promise<void> {
      await httpClient.patch(`/users/${id}/profile`, data)
    },
}