import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, LogOut, User as UserIcon, Shield, ChevronDown } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useUiStore } from "@/store/uiStore"
import { GlobalSearch } from "./GlobalSearch"
import { NotificationsPopover } from "./NotificationsPopover"

export function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { setMobileSidebarOpen, addToast } = useUiStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    addToast({
      title: "Signed out",
      description: "You have been successfully signed out of ATLAS Workspace.",
      type: "info",
    })
    navigate("/login")
  }

  // Generate user initials
  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AW"

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-[#16313B] hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <GlobalSearch />
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        <NotificationsPopover />

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* User Account Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#219C85]/20"
          >
            <div className="w-9 h-9 rounded-full bg-[#DDF4E8] text-[#146152] font-bold text-xs flex items-center justify-center border border-[#BEE8D4] shrink-0 shadow-2xs">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#16313B] leading-tight truncate max-w-[120px]">
                {user?.full_name || "Alex Mercer"}
              </span>
              <span className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                {user?.role === "admin" && <Shield className="w-2.5 h-2.5 text-[#219C85]" />}
                {user?.role || "Member"}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#E2E8F0] shadow-elevation p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-[#16313B] truncate">
                  {user?.full_name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false)
                  navigate("/profile")
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-[#16313B] hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Profile Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left mt-1"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
