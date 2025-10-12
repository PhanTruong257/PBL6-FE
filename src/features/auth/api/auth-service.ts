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
 */
export const AuthService = {
  /**
   * Login user
   */
  async login(
    data: LoginRequest,
  ): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      '/users/login',
      data,
    )
    return response.data
  },

  /**
   * Register new user
   */
  async register(
    data: RegisterRequest,
  ): Promise<AuthApiResponse<RegisterResponse>> {


    const dataSend = { ...data, role: 'user', status: 'active' };
    console.log(dataSend);
    const response = await httpClient.post<AuthApiResponse<RegisterResponse>>(
      '/users/create',
      dataSend,
    )
    return response.data
  },

  /**
   * Request password reset (send OTP to email)
   */
  async forgotPassword(
    data: ForgotPasswordRequest,
  ): Promise<AuthApiResponse<ForgotPasswordResponse>> {
    const response = await httpClient.post<
      AuthApiResponse<ForgotPasswordResponse>
    >('/users/forgot-password', data)
    return response.data
  },

  /**
   * Verify OTP code
   */
  async verifyCode(
    data: VerifyCodeRequest,
  ): Promise<AuthApiResponse<VerifyCodeResponse>> {
    const response = await httpClient.post<
      AuthApiResponse<VerifyCodeResponse>
    >('/users/verify-code', data)
    return response.data
  },

  /**
   * Reset password with token
   */
  async resetPassword(
    data: ResetPasswordRequest,
  ): Promise<AuthApiResponse<ResetPasswordResponse>> {
    const response = await httpClient.post<
      AuthApiResponse<ResetPasswordResponse>
    >('/users/reset-password', data)
    return response.data
  },

  /**
   * Resend verification code
   */
  async resendCode(
    data: ForgotPasswordRequest,
  ): Promise<AuthApiResponse<ForgotPasswordResponse>> {
    const response = await httpClient.post<
      AuthApiResponse<ForgotPasswordResponse>
    >('/users/forgot-password', data)
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken(
    data: RefreshTokenRequest,
  ): Promise<AuthApiResponse<RefreshTokenResponse>> {
    const response = await httpClient.post<
      AuthApiResponse<RefreshTokenResponse>
    >('/auth/refresh-token', data)
    return response.data
  },

  /**
   * Logout user
   */
  async logout(): Promise<AuthApiResponse<{ message: string }>> {
    const response = await httpClient.post<
      AuthApiResponse<{ message: string }>
    >('/auth/logout')
    return response.data
  },

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<AuthApiResponse<User>> {
    const response = await httpClient.get<AuthApiResponse<User>>('/auth/me')
    return response.data
  },
}
