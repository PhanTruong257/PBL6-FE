import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store'
import type { ApiResponse } from '@/types'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { user } = useAuthStore.getState()
    
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    const { response } = error
    
    if (response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      const { logout } = useAuthStore.getState()
      logout()
      window.location.href = '/login'
    }
    
    if (response?.status === 403) {
      // Forbidden - show error message
      console.error('Access denied')
    }
    
    if (response?.status && response.status >= 500) {
      // Server error
      console.error('Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

export { api }
export default api