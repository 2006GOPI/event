const TOKEN_KEY = "atlas_access_token"
const REFRESH_KEY = "atlas_refresh_token"
const USER_KEY = "atlas_user_profile"

export const storage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {}
  },
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_KEY)
    } catch {
      return null
    }
  },
  setRefreshToken(token: string): void {
    try {
      localStorage.setItem(REFRESH_KEY, token)
    } catch {}
  },
  getUser<T>(): T | null {
    try {
      const data = localStorage.getItem(USER_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  },
  setUser<T>(user: T): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {}
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {}
  },
}
