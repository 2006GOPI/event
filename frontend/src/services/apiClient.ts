import { storage } from "@/utils/storage"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options

  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  if (params) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value))
      }
    })
    const queryString = query.toString()
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString
    }
  }

  const token = storage.getToken()
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  }

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    headers: requestHeaders,
    ...restOptions,
  })

  // Handle file blob responses (e.g. CSV exports)
  if (options.headers && (options.headers as any)["Accept"] === "text/csv") {
    if (!response.ok) {
      throw new ApiError(response.status, "Failed to download export file")
    }
    return (await response.blob()) as unknown as T
  }

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred"
    try {
      const errorJson = await response.json()
      if (typeof errorJson.detail === "string") {
        errorDetail = errorJson.detail
      } else if (Array.isArray(errorJson.detail)) {
        errorDetail = errorJson.detail
          .map((item: any) => {
            const field = item.loc ? item.loc.slice(-1)[0] : ""
            return field ? `${field}: ${item.msg}` : item.msg || JSON.stringify(item)
          })
          .join(" | ")
      } else if (errorJson.detail && typeof errorJson.detail === "object") {
        errorDetail = JSON.stringify(errorJson.detail)
      } else if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      errorDetail = response.statusText || errorDetail
    }

    if (response.status === 401) {
      // Clear token if expired or unauthorized
      storage.clear()
    }

    throw new ApiError(response.status, errorDetail)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}
