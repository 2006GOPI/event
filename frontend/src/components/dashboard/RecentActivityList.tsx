import React from "react"
import { Plus, Edit2, CheckCircle2, Download, LogIn, ArrowRight } from "lucide-react"
import { ActivityItem } from "@/types"
import { formatRelativeTime } from "@/utils/formatters"
import { Skeleton } from "@/components/ui/Skeleton"
import { Link } from "react-router-dom"

interface RecentActivityListProps {
  activities: ActivityItem[]
  isLoading: boolean
}

export function RecentActivityList({ activities, isLoading }: RecentActivityListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-card space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 items-center">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Plus className="w-4 h-4 text-[#219C85]" />
      case "update":
        return <Edit2 className="w-4 h-4 text-blue-600" />
      case "status_change":
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      case "export":
        return <Download className="w-4 h-4 text-violet-600" />
      case "login":
        return <LogIn className="w-4 h-4 text-amber-600" />
      default:
        return <Edit2 className="w-4 h-4 text-slate-500" />
    }
  }

  const getActionBg = (type: string) => {
    switch (type) {
      case "create":
        return "bg-[#DDF4E8]"
      case "update":
        return "bg-blue-50"
      case "status_change":
        return "bg-emerald-50"
      case "export":
        return "bg-violet-50"
      case "login":
        return "bg-amber-50"
      default:
        return "bg-slate-100"
    }
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#16313B]">Recent Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time team audit trail</p>
        </div>
        <Link
          to="/records"
          className="text-xs font-semibold text-[#219C85] hover:text-[#1B826F] flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No recent activity entries recorded.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {activities.slice(0, 6).map((item) => (
            <div key={item.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${getActionBg(
                  item.action_type
                )}`}
              >
                {getActionIcon(item.action_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#16313B] leading-snug truncate">
                  {item.description}
                </p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {formatRelativeTime(item.created_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
