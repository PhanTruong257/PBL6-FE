import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { User, LoginCredentials, RegisterData } from "@/types/auth";
import { apiLogin, apiRegister, apiLogout, apiGetCurrentUser } from "@/services/auth-service";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      
      login: async (credentials) => {
        try {
          set({ loading: true, error: null });
          const user = await apiLogin(credentials);
          set({ user, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to login", 
            loading: false 
          });
        }
      },
      
      register: async (data) => {
        try {
          set({ loading: true, error: null });
          const user = await apiRegister(data);
          set({ user, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to register", 
            loading: false 
          });
        }
      },
      
      logout: async () => {
        try {
          set({ loading: true });
          await apiLogout();
          set({ user: null, loading: false, error: null });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Failed to logout", 
            loading: false 
          });
        }
      },
      
      getCurrentUser: async () => {
        try {
          set({ loading: true, error: null });
          const user = await apiGetCurrentUser();
          set({ user, loading: false });
        } catch (error) {
          set({ 
            user: null,
            error: error instanceof Error ? error.message : "Failed to get user", 
            loading: false 
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);