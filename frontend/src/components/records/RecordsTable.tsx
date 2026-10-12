import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Layers,
  Plus,
} from "lucide-react"
import { RecordItem } from "@/types"
import { useRecordsStore } from "@/store/recordsStore"
import { useUiStore } from "@/store/uiStore"
import { formatDate, getStatusColor, getPriorityBadge } from "@/utils/formatters"
import { Checkbox } from "@/components/ui/Checkbox"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"

interface RecordsTableProps {
  onEditRecord: (record: RecordItem) => void
  onDeleteRecord: (record: RecordItem) => void
}

export function RecordsTable({ onEditRecord, onDeleteRecord }: RecordsTableProps) {
  const navigate = useNavigate()
  const {
    records,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    selectedIds,
    toggleSelectRecord,
    toggleSelectAll,
    clearSelection,
    bulkDelete,
    openDrawer,
    setFilter,
    updateRecord,
  } = useRecordsStore()

  const { addToast } = useUiStore()
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)

  const isAllSelected = records.length > 0 && selectedIds.length === records.length

  const handleStatusQuickChange = async (record: RecordItem, newStatus: any) => {
    try {
      await updateRecord(record.id, { status: newStatus })
      addToast({
        title: "Status updated",
        description: `Record '${record.title}' is now ${newStatus}.`,
        type: "success",
      })
      setActiveMenuId(null)
    } catch {
      addToast({
        title: "Update failed",
        description: "Could not update status.",
        type: "error",
      })
    }
  }

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) {
      try {
        const count = await bulkDelete()
        addToast({
          title: "Records deleted",
          description: `Successfully deleted ${count} records.`,
          type: "success",
        })
      } catch {
        addToast({
          title: "Delete failed",
          description: "Could not complete bulk deletion.",
          type: "error",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-card space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-48 flex-1" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-12 text-center shadow-card space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#DDF4E8] text-[#219C85] flex items-center justify-center mx-auto">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#16313B]">No records found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          There are no records matching your current filter criteria or in this workspace.
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/create-record")}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Record
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-card overflow-hidden">
      {/* Bulk action toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#DDF4E8]/60 border-b border-[#BEE8D4] px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
          <span className="font-semibold text-[#146152]">
            {selectedIds.length} {selectedIds.length === 1 ? "record" : "records"} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              className="py-1 px-2.5 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete Selected
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={clearSelection}
              className="py-1 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-3 px-4 w-10">
                <Checkbox
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {records.map((record) => {
              const statusStyle = getStatusColor(record.status)
              const priorityStyle = getPriorityBadge(record.priority)
              const isSelected = selectedIds.includes(record.id)

              return (
                <tr
                  key={record.id}
                  className={`hover:bg-slate-50/70 transition-colors group ${
                    isSelected ? "bg-[#DDF4E8]/20" : ""
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="py-3.5 px-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelectRecord(record.id)}
                    />
                  </td>

                  {/* Title & Description */}
                  <td
                    className="py-3.5 px-4 cursor-pointer max-w-xs sm:max-w-md"
                    onClick={() => openDrawer(record)}
                  >
                    <div className="font-semibold text-[#16313B] group-hover:text-[#219C85] transition-colors truncate">
                      {record.title}
                    </div>
                    {record.description && (
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 max-w-sm">
                        {record.description}
                      </p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {record.category}
                    </span>
                  </td>

                  {/* Priority Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                    >
                      {record.priority}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {record.status}
                    </span>
                  </td>

                  {/* Updated Timestamp */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {formatDate(record.updated_at)}
                  </td>

                  {/* Row Actions */}
                  <td className="py-3.5 px-4 text-right relative">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openDrawer(record)}
                        className="p-1.5 text-slate-400 hover:text-[#219C85] hover:bg-slate-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === record.id ? null : record.id)
                        }
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === record.id && (
                        <div
                          className="absolute right-4 top-10 w-44 rounded-xl bg-white border border-[#E2E8F0] shadow-elevation p-1.5 z-20 text-left animate-in fade-in zoom-in-95"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              openDrawer(record)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-2.5 py-1.5 rounded-md text-xs text-[#16313B] hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> View Details
                          </button>
                          <button
                            onClick={() => {
                              onEditRecord(record)
                              setActiveMenuId(null)
                            }}
                            className="w-full px-2.5 py-1.5 rounded-md text-xs text-[#16313B] hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Edit Record
                          </button>

                          <div className="border-t border-slate-100 my-1 pt-1">
                            <p className="px-2.5 text-[10px] font-bold text-slate-400 uppercase">
                              Set Status
                            </p>
                            {["Open", "In Progress", "Completed"].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleStatusQuickChange(record, st)}
                                className="w-full px-2.5 py-1 rounded-md text-[11px] text-slate-600 hover:bg-[#DDF4E8]/40 hover:text-[#146152] text-left"
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          <div className="border-t border-slate-100 my-1 pt-1">
                            <button
                              onClick={() => {
                                onDeleteRecord(record)
                                setActiveMenuId(null)
                              }}
                              className="w-full px-2.5 py-1.5 rounded-md text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 text-left"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 border-t border-[#E2E8F0] bg-slate-50/50 text-xs text-slate-500">
        <div>
          Showing{" "}
          <span className="font-semibold text-[#16313B]">
            {Math.min(total, (page - 1) * pageSize + 1)}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-[#16313B]">
            {Math.min(total, page * pageSize)}
          </span>{" "}
          of <span className="font-semibold text-[#16313B]">{total}</span> records
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setFilter("page", page - 1)}
            className="py-1 px-2.5 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
          </Button>
          <span className="font-medium text-[#16313B] px-2">
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setFilter("page", page + 1)}
            className="py-1 px-2.5 text-xs"
          >
            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
