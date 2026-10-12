import React from "react"
import { Eye, CheckCircle2, HelpCircle, ArrowRight, Calendar, Tag, User } from "lucide-react"
import { RecordFormData } from "@/schemas/recordSchemas"
import { formatDate, getPriorityBadge, getStatusColor } from "@/utils/formatters"
import { useAuthStore } from "@/store/authStore"

interface LivePreviewSidebarProps {
  formData: Partial<RecordFormData>
}

export function LivePreviewSidebar({ formData }: LivePreviewSidebarProps) {
  const { user } = useAuthStore()

  // Calculate form completion percentage
  const fields = [
    Boolean(formData.title && formData.title.length >= 3),
    Boolean(formData.description && formData.description.length > 5),
    Boolean(formData.category),
    Boolean(formData.priority),
    Boolean(formData.status),
    Boolean(formData.tags && formData.tags.length > 0),
    Boolean(formData.checklist && formData.checklist.length > 0),
  ]
  const completedCount = fields.filter(Boolean).length
  const completionPercentage = Math.round((completedCount / fields.length) * 100)

  const statusStyle = getStatusColor(formData.status || "Open")
  const priorityStyle = getPriorityBadge(formData.priority || "Medium")

  return (
    <div className="space-y-4">
      {/* Live Record Preview Card */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#146152]">
            <Eye className="w-4 h-4 text-[#219C85]" /> Live Record Preview
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Real-time
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
              {formData.status || "Open"}
            </span>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              {formData.priority || "Medium"}
            </span>

            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
              {formData.category || "General"}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-sm text-[#16313B] leading-tight">
            {formData.title || "Untitled Record"}
          </h4>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
            {formData.description || "Enter a description in the form to see a preview."}
          </p>

          {/* Tags */}
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {formData.tags.map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#DDF4E8]/60 text-[#146152] border border-[#BEE8D4]"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Metadata Snippet */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> Owner
              </span>
              <span className="font-medium text-[#16313B]">{user?.full_name || "You"}</span>
            </div>
            {formData.due_date && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Target Date
                </span>
                <span className="font-medium text-[#16313B]">
                  {formatDate(formData.due_date)}
                </span>
              </div>
            )}
            {formData.checklist && formData.checklist.length > 0 && (
              <div className="flex items-center justify-between">
                <span>Checklist Tasks</span>
                <span className="font-medium text-[#219C85]">
                  {formData.checklist.length} items defined
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Completion Readiness Gauge */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-card">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-[#16313B]">Record Readiness</span>
          <span className="font-bold text-[#219C85]">{completionPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#219C85] to-[#5DBE97] transition-all duration-300 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {completedCount} of {fields.length} recommended sections filled
        </p>
      </div>

      {/* Tips and Next Steps */}
      <div className="rounded-xl border border-[#BEE8D4] bg-[#DDF4E8]/40 p-4 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-[#146152]">
          <HelpCircle className="w-3.5 h-3.5 text-[#219C85]" /> What happens next?
        </div>
        <p className="text-[#16313B]/80 text-[11px] leading-relaxed">
          1. Validated and persisted directly to the PostgreSQL database.
          <br />
          2. Generates an automated activity log event in your workspace audit trail.
          <br />
          3. Instantly accessible to the AI Assistant for natural language answers.
        </p>
      </div>
    </div>
  )
}
