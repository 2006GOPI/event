import React from "react"
import { Link } from "react-router-dom"
import { Compass, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F7FAF9] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#DDF4E8] text-[#219C85] flex items-center justify-center mb-6 shadow-card">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#16313B] tracking-tight">404 — Page Not Found</h1>
      <p className="text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
        The destination you requested does not exist or may have been relocated.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
