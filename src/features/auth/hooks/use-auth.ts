import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useSetRecoilState } from 'recoil'

import { AuthService } from '../api/auth-service'
import { tokenStorage, tempStorage } from '@/libs/utils'
import { usersState } from '../../../global/recoil/user'

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
  User,
} from '../types'

/**
 * Query keys for React Query
 */
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

/**
 * Hook for login
 */
export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setUser = useSetRecoilState(usersState)

  return useMutation({
    mutationFn: (data: LoginRequest) => {
      // Clear any existing tokens before attempting login
      tokenStorage.clearTokens()
      queryClient.removeQueries({ queryKey: authKeys.user() })

      return AuthService.login(data)
    },
    onSuccess: (response) => {
      console.log('🚀 Login response received:', response)
      const { user, accessToken, refreshToken } = response.data;

      console.log('🚀 Login successful:', user)
      console.log('Access Token:', accessToken)
      console.log('Refresh Token:', refreshToken)

      // Save tokens and user info
      tokenStorage.setTokens(accessToken, refreshToken)
      tokenStorage.setUser(user)
      setUser(user)

      // Update cache
      queryClient.setQueryData(authKeys.user(), user)

      const redirectPath = '/user/dashboard'
      navigate({ to: redirectPath as any })
    },
    onError: (error) => {
      console.log('🚨 Login failed:', error)
    },
  })
}

/**
 * Hook for registration
 */
export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthService.register(data),
    onSuccess: () => {
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate({ to: '/auth/login' })
      }, 2000)
    },
  })
}

/**
 * Hook for forgot password
 */
export function useForgotPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => AuthService.forgotPassword(data),
    onSuccess: (_response, variables) => {
      // Save email to sessionStorage for next step
      tempStorage.setResetEmail(variables.email)

      // Navigate to verify code page
      navigate({ to: '/auth/verify-code' })
    },
  })
}

/**
 * Hook for verify OTP code
 */
export function useVerifyCode() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: VerifyCodeRequest) => AuthService.verifyCode(data),
    onSuccess: (_response, variables) => {
      // Save code to sessionStorage for next step
      tempStorage.setResetCode(variables.code)

      // Navigate to reset password page
      navigate({ to: '/auth/reset-password' })
    },
  })
}

/**
 * Hook for reset password
 */
export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
    onSuccess: () => {
      // Clear temp data after successful reset
      tempStorage.clearResetData()

      // Redirect to login page
      setTimeout(() => {
        navigate({ to: '/auth/login' })
      }, 2000)
    },
  })
}

/**
 * Hook for resend code
 */
export function useResendCode() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => AuthService.resendCode(data),
  })
}

/**
 * Hook for logout
 */
export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: () => {
      // Always clear local data, even if API call fails
      queryClient.clear()
      tokenStorage.clearTokens()
      navigate({ to: '/auth/login' })
    },
  })
}

/**
 * Hook to get current user from API
 */
export function useCurrentUser() {
  const hasToken = !!tokenStorage.getAccessToken()

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => AuthService.getCurrentUser().then((res) => res.data),
    enabled: hasToken, // Only run if user has token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized)
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, isFetching } = useCurrentUser()
  const token = tokenStorage.getAccessToken()
  const isAuthenticated = !!(user && token)

  return {
    isAuthenticated,
    isLoading: isLoading || isFetching,
    user,
  }
}

/**
 * Hook to get user from localStorage (without API call)
 */
export function useUserFromStorage() {
  return tokenStorage.getUser<User>()
}
