import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  FileSpreadsheet,
  PlusCircle,
  BarChart3,
  FileText,
  Bot,
  Settings,
  User,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/utils/cn"
import { useUiStore } from "@/store/uiStore"
import { useAssistantStore } from "@/store/assistantStore"

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  isPrimary: boolean
  badge?: string
}

export function Sidebar() {
  const location = useLocation()
  const { sidebarCollapsed, toggleSidebar, mobileSidebarOpen, setMobileSidebarOpen, addToast } = useUiStore()
  const { openAssistant } = useAssistantStore()

  const mainNavItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, isPrimary: true },
    { name: "Records", href: "/records", icon: FileSpreadsheet, isPrimary: true },
    { name: "Create / Submit", href: "/create-record", icon: PlusCircle, isPrimary: true },
    { name: "Analytics", href: "/analytics", icon: BarChart3, isPrimary: false, badge: "Beta" },
    { name: "Reports", href: "/reports", icon: FileText, isPrimary: false },
    { name: "AI Assistant", href: "#assistant", icon: Bot, isPrimary: false },
  ]

  const bottomNavItems: NavItem[] = [
    { name: "Settings", href: "/settings", icon: Settings, isPrimary: false },
    { name: "Profile", href: "/profile", icon: User, isPrimary: false },
    { name: "About", href: "/about", icon: Info, isPrimary: false },
  ]

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    if (item.href === "#assistant") {
      e.preventDefault()
      openAssistant()
      setMobileSidebarOpen(false)
      return
    }

    if (!item.isPrimary) {
      e.preventDefault()
      addToast({
        title: `${item.name} is in development`,
        description: "This feature is planned for the upcoming ATLAS release.",
        type: "info",
      })
      setMobileSidebarOpen(false)
    } else {
      setMobileSidebarOpen(false)
    }
  }

  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.href

        return (
          <li key={item.name}>
            <NavLink
              to={item.href}
              onClick={(e) => handleNavClick(item, e)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 select-none",
                isActive
                  ? "bg-[#DDF4E8] text-[#146152] font-semibold shadow-xs"
                  : "text-[#16313B]/80 hover:bg-slate-100 hover:text-[#16313B]"
              )}
              title={sidebarCollapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  isActive ? "text-[#219C85]" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {!sidebarCollapsed && (
                <span className="flex-1 truncate">{item.name}</span>
              )}
              {!sidebarCollapsed && item.badge && (
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                  {item.badge}
                </span>
              )}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#16313B]/30 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-[#E2E8F0] transition-all duration-250 ease-in-out lg:static shadow-sm",
          sidebarCollapsed ? "w-18" : "w-64",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#219C85] to-[#146152] flex items-center justify-center text-white font-black text-lg shadow-sm shadow-[#219C85]/20 shrink-0">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-[#16313B]">
                  ATLAS
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#219C85] -mt-1">
                  Workspace
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Nav Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Navigation
              </p>
            )}
            {renderNavList(mainNavItems)}
          </div>

          <div>
            {!sidebarCollapsed && (
              <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Workspace
              </p>
            )}
            {renderNavList(bottomNavItems)}
          </div>
        </div>

        {/* Quick Assistant CTA card in sidebar footer */}
        {!sidebarCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-[#DDF4E8]/60 border border-[#BEE8D4] text-[#146152]">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#219C85]" />
              <span className="text-xs font-semibold">ATLAS Intelligence</span>
            </div>
            <p className="text-[11px] text-[#16313B]/80 mb-2 leading-relaxed">
              Ask AI to analyze records or summarize workload anytime.
            </p>
            <button
              onClick={openAssistant}
              className="w-full py-1.5 px-2 bg-[#219C85] text-white rounded-lg text-xs font-medium hover:bg-[#1B826F] transition-colors shadow-xs"
            >
              Ask Assistant
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
