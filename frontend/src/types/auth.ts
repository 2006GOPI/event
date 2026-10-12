export interface User {
  id: number
  email: string
  full_name: string
  role: "admin" | "member" | "viewer"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  refresh_token?: string
  user: User
}
