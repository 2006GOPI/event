import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuthStore()
  const location = useLocation()

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F7FAF9] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#DDF4E8] text-[#219C85] flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Loading ATLAS Workspace...
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
