import React from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, FileSpreadsheet, Bot, Download } from "lucide-react"
import { useAssistantStore } from "@/store/assistantStore"
import { useRecordsStore } from "@/store/recordsStore"
import { useUiStore } from "@/store/uiStore"

export function QuickActions() {
  const navigate = useNavigate()
  const { openAssistant } = useAssistantStore()
  const { exportCsv } = useRecordsStore()
  const { addToast } = useUiStore()

  const handleExport = async () => {
    try {
      await exportCsv()
      addToast({
        title: "Export started",
        description: "Your filtered records CSV download is ready.",
        type: "success",
      })
    } catch {
      addToast({
        title: "Export failed",
        description: "Could not generate CSV export at this time.",
        type: "error",
      })
    }
  }

  const actions = [
    {
      title: "Create Record",
      desc: "Add structured entry with tags & checklist",
      icon: PlusCircle,
      onClick: () => navigate("/create-record"),
      color: "bg-[#DDF4E8] text-[#146152] border-[#BEE8D4]",
    },
    {
      title: "View Records",
      desc: "Search, filter, edit & manage rows",
      icon: FileSpreadsheet,
      onClick: () => navigate("/records"),
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Ask AI Assistant",
      desc: "Get real-time workspace insights",
      icon: Bot,
      onClick: openAssistant,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Export Dataset",
      desc: "Download RFC 4180 compliant CSV",
      icon: Download,
      onClick: handleExport,
      color: "bg-violet-50 text-violet-700 border-violet-200",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((act) => {
        const Icon = act.icon
        return (
          <button
            key={act.title}
            onClick={act.onClick}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-[#E2E8F0] bg-white shadow-card hover:shadow-elevation transition-all text-left group"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border group-hover:scale-105 transition-transform ${act.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-[#16313B] group-hover:text-[#219C85] transition-colors truncate">
                {act.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{act.desc}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
