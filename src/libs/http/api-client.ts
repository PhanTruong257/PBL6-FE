import { httpClient } from './axios-instance'
import type { AxiosRequestConfig } from 'axios'

interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.get<ApiResponse<T>>(url, config)
    return data.data
  },

  post: async <T, TPayload = any>(url: string, payload?: TPayload, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.post<ApiResponse<T>>(url, payload, config)
    return data.data
  },

  put: async <T, TPayload = any>(url: string, payload?: TPayload, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.put<ApiResponse<T>>(url, payload, config)
    return data.data
  },

  patch: async <T, TPayload = any>(url: string, payload?: TPayload, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.patch<ApiResponse<T>>(url, payload, config)
    return data.data
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const { data } = await httpClient.delete<ApiResponse<T>>(url, config)
    return data.data
  },

  upload: async <T>(url: string, formData: FormData, onProgress?: (progress: number) => void) => {
    const { data } = await httpClient.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    })
    return data.data
  },
}