import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { cookieStorage } from '@/libs/utils/cookie'
import type { IApiResponse } from '@/types/api'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor
 * Automatically adds Authorization and x-refresh-token headers from cookie storage
 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = cookieStorage.getAccessToken()
    const refreshToken = cookieStorage.getRefreshToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Add refresh token header for backend
    if (refreshToken) {
      config.headers['x-refresh-token'] = refreshToken
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/**
 * Response interceptor
 * Handles IApiResponse format and 401 errors
 */
httpClient.interceptors.response.use(
  (response: AxiosResponse<IApiResponse<any>>) => {
    // The backend returns data in the format: { success, message, data, error? }
    // We keep the full response so callers can access response.data.data
    return response
  },
  (error: AxiosError<IApiResponse<any>>) => {
    if (error.response?.status === 401) {
      // Don't redirect if already on auth pages
      const currentPath = window.location.pathname
      if (!currentPath.startsWith('/auth/')) {
        cookieStorage.clearTokens()
        window.location.href = '/auth/login'
      } else {
        cookieStorage.clearTokens()
      }
    }
    return Promise.reject(error)
  }
)