import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor
 */
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Get token from auth store (localStorage is just for demo)
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Shouldn't check headers, axios default headers is never undefined
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/**
 * Response interceptor
 */
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: Handle unauthorized access (e.g., redirect to login), change auth store
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)