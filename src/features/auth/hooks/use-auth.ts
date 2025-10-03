import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AuthService } from '../api/auth-service'
import { tokenStorage } from '@/libs/utils/storage'
import { DEFAULT_ROUTES_BY_ROLE } from '@/libs/constants'
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

  return useMutation({
    mutationFn: (data: LoginRequest) => AuthService.login(data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data

      // Save tokens and user info
      tokenStorage.setTokens(accessToken, refreshToken)
      tokenStorage.setUser(user)

      // Update cache
      queryClient.setQueryData(authKeys.user(), user)

      // Redirect based on role
      const redirectPath =
        DEFAULT_ROUTES_BY_ROLE[user.role as keyof typeof DEFAULT_ROUTES_BY_ROLE]

      navigate({ to: redirectPath as any })
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
    mutationFn: (data: ForgotPasswordRequest) =>
      AuthService.forgotPassword(data),
    onSuccess: (response, variables) => {
      // Navigate to verify code page with email and requestId
      setTimeout(() => {
        navigate({
          to: '/auth/verify-code',
          search: {
            email: variables.email,
            requestId: response.data.requestId,
          },
        })
      }, 1000)
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
    onSuccess: (response, variables) => {
      // Navigate to reset password page with token
      navigate({
        to: '/auth/reset-password',
        search: {
          email: variables.email,
          token: response.data.resetToken,
        },
      })
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
      // Redirect to login page after successful password reset
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
  })
}

/**
 * Hook to check authentication status
 */
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser()
  const token = tokenStorage.getAccessToken()

  return {
    isAuthenticated: !!(user && token),
    isLoading,
    user,
  }
}

/**
 * Hook to get user from localStorage (without API call)
 */
export function useUserFromStorage() {
  return tokenStorage.getUser<User>()
}
