import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useAuth as useAuthState } from '@/global/hooks/use-auth'

import { AuthService } from '../apis/auth-service'
import { cookieStorage } from '@/libs/utils/cookie'
import { sessionStorage } from '@/libs/utils/session-storage'

import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
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
  const { setUser } = useAuthState()

  return useMutation({
    mutationFn: (data: LoginRequest) => {
      // Clear any existing tokens before attempting login
      cookieStorage.clearTokens()
      queryClient.removeQueries({ queryKey: authKeys.user() })

      return AuthService.login(data)
    },
    onSuccess: async (response) => {
      const { user, accessToken, refreshToken } = response

      // Save tokens to cookies
      cookieStorage.setTokens(accessToken, refreshToken)

      // Fetch complete user data from /users/me (includes roles & permissions)
      try {
        const userDataResponse = await AuthService.getCurrentUser()
        const userData = userDataResponse.data

        // Update auth state with complete user data
        setUser(userData)

        // Update React Query cache
        queryClient.setQueryData(authKeys.user(), userData)

        const redirectPath = userData.role === 'admin' ? '/admin/manage-users' : '/classes'
        navigate({ to: redirectPath as any })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Fallback: Set basic user info from login response
        setUser(user)
        queryClient.setQueryData(authKeys.user(), user)
      }

    },
    onError: (error) => {
      console.log('Login failed:', error)
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
    onSuccess: (_response, variables) => {
      // Save email to sessionStorage for next step
      sessionStorage.set('temp_reset_email', variables.email)

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
      sessionStorage.set('temp_reset_code', variables.code)

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
      sessionStorage.remove('temp_reset_email')
      sessionStorage.remove('temp_reset_code')

      // Redirect to login page
      navigate({ to: '/auth/login' })
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
  const { clearAuth } = useAuthState()

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSettled: () => {
      // Always clear local data, even if API call fails
      // Clear React Query cache
      queryClient.clear()

      // Clear auth state and tokens
      clearAuth()

      // Clear session storage
      sessionStorage.clear()

      // Navigate to login page
      navigate({ to: '/auth/login' })
    },
  })
}
