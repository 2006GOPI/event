import React from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant"
import { ToastContainer } from "@/components/ui/Toast"

export function WorkspaceLayout() {
  return (
    <div className="flex h-screen bg-[#F7FAF9] overflow-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Topbar */}
        <Topbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Notifications Viewport */}
      <ToastContainer />

      {/* Persistent Floating AI Assistant Launcher on bottom right */}
      <FloatingAssistant />
    </div>
  )
}
