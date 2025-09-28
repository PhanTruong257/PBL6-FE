import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/services/api/auth'
import { useAuthStore } from '@/store'

// Login mutation
export const useLogin = () => {
  const { login: setAuth } = useAuthStore()
  
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, token }) => {
      setAuth({ ...user, token })
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Register mutation
export const useRegister = () => {
  const { login: setAuth } = useAuthStore()
  
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ user, token }) => {
      setAuth({ ...user, token })
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })
}

// Logout mutation
export const useLogout = () => {
  const { logout: clearAuth } = useAuthStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth()
      queryClient.clear() // Clear all cached data
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      clearAuth()
      queryClient.clear()
    },
  })
}

// Current user query
export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  })
}

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
  })
}