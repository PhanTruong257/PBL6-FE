import { httpClient } from '@/libs/http'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  AuthApiResponse,
} from '../types'

/**
 * Auth Service - API calls for authentication
 * Updated to use IApiResponse format: response.data.data
 */
export const AuthService = {
  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<AuthApiResponse<LoginResponse>>('/users/login', data)
    return response.data.data
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const dataSend = { ...data, role: 'user', status: 'active' }
    console.log(dataSend)
    const response = await httpClient.post<AuthApiResponse<RegisterResponse>>(
      '/users/create',
      dataSend,
    )
    return response.data.data
  },

  /**
   * Request password reset (send OTP to email)
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await httpClient.post<AuthApiResponse<ForgotPasswordResponse>>(
      '/users/forgot-password',
      data
    )
    return response.data.data
  },

  /**
   * Verify OTP code
   */
  async verifyCode(data: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await httpClient.post<AuthApiResponse<VerifyCodeResponse>>(
      '/users/verify-code',
      data
    )
    return response.data.data
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await httpClient.post<AuthApiResponse<ResetPasswordResponse>>(
      '/users/reset-password',
      data
    )
    return response.data.data
  },

  /**
   * Resend verification code
   */
  async resendCode(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await httpClient.post<AuthApiResponse<ForgotPasswordResponse>>(
      '/users/forgot-password',
      data
    )
    return response.data.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await httpClient.post<AuthApiResponse<RefreshTokenResponse>>(
      '/users/refresh-token',
      data
    )
    return response.data.data
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    const response = await httpClient.post<AuthApiResponse<{ message: string }>>('/users/logout')
    return response.data.data
  },

  /**
   * Get current user info with roles and permissions
   */
  async getCurrentUser(): Promise<AuthApiResponse<User>> {
    const response = await httpClient.get<AuthApiResponse<User>>('/users/me')
    return response.data
  },
}
