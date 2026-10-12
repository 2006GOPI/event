import React from "react"
import { Layers, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { RecordItem } from "@/types"

interface RecordSummaryCardsProps {
  records: RecordItem[]
  total: number
}

export function RecordSummaryCards({ records, total }: RecordSummaryCardsProps) {
  // Compute counts from records
  const inProgressCount = records.filter((r) => r.status === "In Progress").length
  const completedCount = records.filter((r) => r.status === "Completed").length
  const highPriorityCount = records.filter(
    (r) => (r.priority === "High" || r.priority === "Urgent") && r.status !== "Completed"
  ).length

  const cards = [
    {
      title: "Total Records",
      count: total,
      desc: "All tracked records",
      icon: Layers,
      color: "text-[#219C85]",
      bg: "bg-[#DDF4E8]",
    },
    {
      title: "In Progress",
      count: inProgressCount,
      desc: "Currently being executed",
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Completed",
      count: completedCount,
      desc: "Verified & finalized",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "High Priority",
      count: highPriorityCount,
      desc: "Urgent items needing review",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-card flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-xl font-extrabold text-[#16313B] mt-0.5">{card.count}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{card.desc}</p>
            </div>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
