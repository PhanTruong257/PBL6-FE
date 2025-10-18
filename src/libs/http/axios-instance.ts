import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { tokenStorage } from '../utils/storage';

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
    const token = tokenStorage.getAccessToken();

    config.headers.Authorization = `Bearer ${token}`

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
      console.log('🚨 401 Error intercepted:', {
        url: error.config?.url,
        currentPath: window.location.pathname
      });

      // Don't redirect if already on auth pages (login/register/forgot-password)
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/auth/')) {
        console.log('🚪 Redirecting to login from 401 error');
        localStorage.removeItem('auth_token')
        window.location.href = '/auth/login'
      } else {
        console.log('🚫 Already on auth page, skipping redirect');
        // Just clear token but don't redirect
        localStorage.removeItem('auth_token')
      }
    }
    return Promise.reject(error)
  }
)