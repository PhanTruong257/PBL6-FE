import type { User, LoginCredentials, RegisterData } from "@/types/auth";
import { apiClient } from "@/lib/api-client";

/**
 * Login with email and password
 */
export async function apiLogin(credentials: LoginCredentials): Promise<User> {
  try {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data.user;
  } catch (error) {
    throw new Error("Invalid email or password");
  }
}

/**
 * Register a new user
 */
export async function apiRegister(registerData: RegisterData): Promise<User> {
  try {
    const { data } = await apiClient.post("/auth/register", registerData);
    return data.user;
  } catch (error) {
    throw new Error("Registration failed");
  }
}

/**
 * Logout current user
 */
export async function apiLogout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    throw new Error("Logout failed");
  }
}

/**
 * Get current authenticated user
 */
export async function apiGetCurrentUser(): Promise<User> {
  try {
    const { data } = await apiClient.get("/auth/me");
    return data.user;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
}

/**
 * Request password reset
 */
export async function apiForgotPassword(email: string): Promise<void> {
  try {
    await apiClient.post("/auth/forgot-password", { email });
  } catch (error) {
    throw new Error("Failed to send password reset email");
  }
}

/**
 * Reset password with token
 */
export async function apiResetPassword(token: string, password: string): Promise<void> {
  try {
    await apiClient.post("/auth/reset-password", { token, password });
  } catch (error) {
    throw new Error("Failed to reset password");
  }
}