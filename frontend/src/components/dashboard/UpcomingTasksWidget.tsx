import React from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, CheckSquare, Lightbulb, ArrowRight } from "lucide-react"
import { RecordItem } from "@/types"
import { formatDate } from "@/utils/formatters"

interface UpcomingTasksWidgetProps {
  records: RecordItem[]
  isLoading: boolean
}

export function UpcomingTasksWidget({ records, isLoading }: UpcomingTasksWidgetProps) {
  const navigate = useNavigate()

  // Filter incomplete records that have due dates or active checklists
  const urgentItems = records
    .filter((r) => r.status !== "Completed" && (r.priority === "Urgent" || r.priority === "High"))
    .slice(0, 4)

  return (
    <div className="space-y-4">
      {/* High Priority Watchlist */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#219C85]" />
            <h3 className="text-sm font-semibold text-[#16313B]">High Priority Focus</h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {urgentItems.length} items
          </span>
        </div>

        {urgentItems.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No critical pending items. All clear!
          </p>
        ) : (
          <div className="space-y-2.5">
            {urgentItems.map((rec) => (
              <div
                key={rec.id}
                onClick={() => navigate("/records")}
                className="p-2.5 rounded-lg border border-slate-100 hover:border-[#219C85]/30 hover:bg-[#DDF4E8]/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#16313B] group-hover:text-[#219C85] truncate pr-2">
                    {rec.title}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      rec.priority === "Urgent"
                        ? "bg-red-50 text-red-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                  <span>{rec.category}</span>
                  {rec.due_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due {formatDate(rec.due_date)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workspace Tips Card */}
      <div className="rounded-xl border border-[#BEE8D4] bg-[#DDF4E8]/50 p-4">
        <div className="flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-[#219C85] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-[#146152]">Workspace Productivity Tip</h4>
            <p className="text-xs text-[#16313B]/80 mt-1 leading-relaxed">
              Use keyboard shortcut <kbd className="px-1 py-0.5 rounded bg-white font-mono text-[10px] border border-[#BEE8D4]">⌘K</kbd> anywhere to quickly search across records, or click the bottom-right bot icon to ask AI for a workspace summary.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
