import React from "react"
import { Layers, Activity, CheckCircle, Percent, TrendingUp, TrendingDown } from "lucide-react"
import { DashboardSummary } from "@/types"
import { Skeleton } from "@/components/ui/Skeleton"
import { cn } from "@/utils/cn"

interface MetricCardsProps {
  summary: DashboardSummary | null
  isLoading: boolean
}

export function MetricCards({ summary, isLoading }: MetricCardsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Total Records",
      value: summary.total_records,
      change: summary.total_records_change,
      icon: Layers,
      color: "text-[#219C85]",
      bgColor: "bg-[#DDF4E8]",
      accentBorder: "hover:border-[#219C85]/40",
    },
    {
      title: "Active Tasks",
      value: summary.active_tasks,
      change: summary.active_tasks_change,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      accentBorder: "hover:border-blue-400/40",
    },
    {
      title: "Completed Items",
      value: summary.completed_items,
      change: summary.completed_items_change,
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      accentBorder: "hover:border-emerald-400/40",
    },
    {
      title: "Completion Rate",
      value: `${summary.completion_rate}%`,
      change: summary.completion_rate_change,
      icon: Percent,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      accentBorder: "hover:border-violet-400/40",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const isPositive = card.change.is_positive

        return (
          <div
            key={card.title}
            className={cn(
              "rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-card transition-all duration-200 hover:shadow-elevation",
              card.accentBorder
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", card.bgColor, card.color)}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#16313B] tracking-tight">
                {card.value}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "font-semibold inline-flex items-center gap-0.5",
                  isPositive ? "text-emerald-600" : "text-slate-500"
                )}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPositive ? "+" : ""}{card.change.value}%
              </span>
              <span className="text-slate-400 text-[11px]">{card.change.label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
