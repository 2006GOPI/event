import React, { useState, useRef, useEffect } from "react"
import { Bell, Check, Clock, Sparkles } from "lucide-react"
import { cn } from "@/utils/cn"

export function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(2)
  const popoverRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Workspace records synchronized",
      description: "10 records indexed into PostgreSQL engine successfully.",
      time: "10m ago",
      read: false,
    },
    {
      id: "2",
      title: "Weekly Summary ready",
      description: "Your completion rate increased by +5.4% this week.",
      time: "2h ago",
      read: false,
    },
    {
      id: "3",
      title: "System upgrade v1.0 deployed",
      description: "Light mint theme and intelligent assistant engine active.",
      time: "1d ago",
      read: true,
    },
  ])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-[#16313B] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#219C85]/20"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#219C85] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#219C85]" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-[#E2E8F0] shadow-elevation z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#16313B]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF4E8] text-[#146152]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-[#219C85] hover:text-[#146152] font-medium flex items-center gap-1 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No recent notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "py-3 px-2 rounded-lg transition-colors",
                    !n.read ? "bg-slate-50/70" : "hover:bg-slate-50/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn("text-xs font-semibold text-[#16313B]", !n.read && "text-[#219C85]")}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
