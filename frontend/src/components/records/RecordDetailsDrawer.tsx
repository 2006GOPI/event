import React from "react"
import {
  Calendar,
  Tag,
  CheckSquare,
  Clock,
  User,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useRecordsStore } from "@/store/recordsStore"
import { useUiStore } from "@/store/uiStore"
import { Drawer } from "@/components/ui/Drawer"
import { Button } from "@/components/ui/Button"
import { formatDate, formatDateTime, getPriorityBadge, getStatusColor } from "@/utils/formatters"

interface RecordDetailsDrawerProps {
  onEdit: (record: any) => void
  onDelete: (record: any) => void
}

export function RecordDetailsDrawer({ onEdit, onDelete }: RecordDetailsDrawerProps) {
  const { activeRecord, isDrawerOpen, closeDrawer, updateRecord } = useRecordsStore()
  const { addToast } = useUiStore()

  if (!activeRecord) return null

  const statusStyle = getStatusColor(activeRecord.status)
  const priorityStyle = getPriorityBadge(activeRecord.priority)

  const handleToggleChecklist = async (index: number) => {
    const updatedChecklist = activeRecord.checklist.map((item, idx) =>
      idx === index ? { ...item, completed: !item.completed } : item
    )

    try {
      await updateRecord(activeRecord.id, { checklist: updatedChecklist })
      addToast({
        title: "Checklist updated",
        description: "Task state saved to database.",
        type: "success",
      })
    } catch {
      addToast({
        title: "Update failed",
        description: "Could not save task state.",
        type: "error",
      })
    }
  }

  const completedChecklistCount = activeRecord.checklist.filter((c) => c.completed).length

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={activeRecord.title}
      width="max-w-xl"
    >
      <div className="space-y-6">
        {/* Title and Badges */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
              {activeRecord.status}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              {activeRecord.priority} Priority
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              {activeRecord.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#16313B] leading-snug">
            {activeRecord.title}
          </h2>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Description
          </h4>
          <p className="text-xs sm:text-sm text-[#16313B]/80 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 whitespace-pre-wrap">
            {activeRecord.description || "No description provided for this record."}
          </p>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 gap-3.5 p-3.5 rounded-xl border border-[#E2E8F0] bg-white text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Due Date</span>
            <span className="font-semibold text-[#16313B] flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(activeRecord.due_date)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Owner</span>
            <span className="font-semibold text-[#16313B] flex items-center gap-1.5 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {activeRecord.owner?.full_name || "Workspace Member"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Created At</span>
            <span className="font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateTime(activeRecord.created_at)}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Last Updated</span>
            <span className="font-medium text-slate-600 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {formatDateTime(activeRecord.updated_at)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {activeRecord.tags && activeRecord.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeRecord.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#DDF4E8]/60 text-[#146152] border border-[#BEE8D4]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" /> Task Checklist
            </h4>
            <span className="text-xs font-bold text-[#219C85]">
              {completedChecklistCount}/{activeRecord.checklist.length} Completed
            </span>
          </div>

          {activeRecord.checklist.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No checklist items defined.</p>
          ) : (
            <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {activeRecord.checklist.map((item, idx) => (
                <label
                  key={item.id || idx}
                  className="flex items-start gap-2.5 cursor-pointer select-none group"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklist(idx)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#219C85] focus:ring-[#219C85]"
                  />
                  <span
                    className={`text-xs ${
                      item.completed
                        ? "line-through text-slate-400"
                        : "text-[#16313B] font-medium"
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(activeRecord)}
            className="text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Record
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={closeDrawer}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(activeRecord)}
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Record
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
