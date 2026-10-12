import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppRouter } from "@/routes/AppRouter"
import { useAuthStore } from "@/store/authStore"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

export function App() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

