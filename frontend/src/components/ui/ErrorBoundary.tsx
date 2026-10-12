import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ATLAS ErrorBoundary:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = "/dashboard"
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7FAF9] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl bg-white border border-[#E2E8F0] shadow-elevation p-6 sm:p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#16313B]">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                An unexpected interface error occurred. You can reload the page or return to the dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-left text-[11px] font-mono text-slate-600 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#219C85] text-white hover:bg-[#1B826F] transition-colors shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border border-[#E2E8F0] bg-white text-[#16313B] hover:bg-slate-50 transition-colors"
              >
                <Home className="w-3.5 h-3.5" /> Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
