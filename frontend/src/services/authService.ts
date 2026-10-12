import { request } from "./apiClient"
import { TokenResponse, User } from "@/types"
import { LoginFormData, RegisterFormData } from "@/schemas/authSchemas"

export const authService = {
  async login(data: LoginFormData): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  async register(data: RegisterFormData): Promise<TokenResponse> {
    const { confirm_password, ...payload } = data
    return request<TokenResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  async getMe(): Promise<User> {
    return request<User>("/auth/me")
  },

  async logout(): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/logout", {
      method: "POST",
    })
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },
}
