/**
 * Auth-specific types
 * Re-exports from global types + auth-specific additions
 */

import type { User } from '@/types/user'
import type { ApiResponse } from '@/types/api'

// Re-export User type
export type { User }

/**
 * Login request/response
 */
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

/**
 * Register request/response
 */
export interface RegisterRequest {
  full_name: string
  email: string
  password: string
  confirmPassword: string

}

export interface RegisterResponse {
  user: User
  message: string
}

/**
 * Forgot password request/response
 */
export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  success: boolean
}

/**
 * Verify code request/response
 */
export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface VerifyCodeResponse {
  message: string
  success: boolean
  isValid: boolean
}

/**
 * Reset password request/response
 */
export interface ResetPasswordRequest {
  email: string
  code: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  message: string
  success: boolean
}

/**
 * Refresh token request/response
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  expiresIn: number
}

/**
 * Auth API response wrappers
 */
export type AuthApiResponse<T> = ApiResponse<T>
