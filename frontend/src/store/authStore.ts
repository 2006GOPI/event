import { create } from "zustand"
import { authService } from "@/services/authService"
import { storage } from "@/utils/storage"
import { User } from "@/types"
import { LoginFormData, RegisterFormData } from "@/schemas/authSchemas"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoading: boolean
  error: string | null
  initAuth: () => Promise<void>
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: storage.getUser<User>(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isInitializing: true,
  isLoading: false,
  error: null,

  initAuth: async () => {
    const token = storage.getToken()
    if (!token) {
      set({ isInitializing: false, isAuthenticated: false, user: null })
      return
    }

    try {
      const user = await authService.getMe()
      storage.setUser(user)
      set({ user, isAuthenticated: true, isInitializing: false })
    } catch {
      storage.clear()
      set({ user: null, token: null, isAuthenticated: false, isInitializing: false })
    }
  },

  login: async (data: LoginFormData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(data)
      storage.setToken(response.access_token)
      if (response.refresh_token) {
        storage.setRefreshToken(response.refresh_token)
      }
      storage.setUser(response.user)

      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.detail || err.message || "Failed to sign in. Please verify your credentials.",
      })
      throw err
    }
  },

  register: async (data: RegisterFormData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.register(data)
      storage.setToken(response.access_token)
      if (response.refresh_token) {
        storage.setRefreshToken(response.refresh_token)
      }
      storage.setUser(response.user)

      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.detail || err.message || "Failed to create account.",
      })
      throw err
    }
  },

  logout: async () => {
    try {
      await authService.logout()
    } catch {}
    storage.clear()
    set({ user: null, token: null, isAuthenticated: false })
  },

  clearError: () => set({ error: null }),
}))
