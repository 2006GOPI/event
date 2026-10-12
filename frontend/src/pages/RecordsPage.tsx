import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Download, RefreshCw, FileSpreadsheet } from "lucide-react"
import { useRecordsStore } from "@/store/recordsStore"
import { useUiStore } from "@/store/uiStore"
import { RecordItem } from "@/types"
import { Button } from "@/components/ui/Button"
import { RecordSummaryCards } from "@/components/records/RecordSummaryCards"
import { RecordFilters } from "@/components/records/RecordFilters"
import { RecordsTable } from "@/components/records/RecordsTable"
import { RecordDetailsDrawer } from "@/components/records/RecordDetailsDrawer"
import { RecordDeleteDialog } from "@/components/records/RecordDeleteDialog"
import { EditRecordModal } from "@/components/records/EditRecordModal"

export function RecordsPage() {
  const navigate = useNavigate()
  const {
    records,
    total,
    fetchRecords,
    isLoading,
    deleteRecord,
    updateRecord,
    exportCsv,
  } = useRecordsStore()

  const { addToast } = useUiStore()

  const [recordToDelete, setRecordToDelete] = useState<RecordItem | null>(null)
  const [recordToEdit, setRecordToEdit] = useState<RecordItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchRecords()
  }, [])

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return
    setIsDeleting(true)
    try {
      await deleteRecord(recordToDelete.id)
      addToast({
        title: "Record deleted",
        description: `Successfully removed '${recordToDelete.title}'.`,
        type: "success",
      })
      setRecordToDelete(null)
    } catch {
      addToast({
        title: "Deletion failed",
        description: "Could not delete record.",
        type: "error",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSave = async (id: number, data: any) => {
    setIsUpdating(true)
    try {
      await updateRecord(id, data)
      addToast({
        title: "Record updated",
        description: "Changes saved to database successfully.",
        type: "success",
      })
    } catch {
      addToast({
        title: "Update failed",
        description: "Could not save changes.",
        type: "error",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExport = async () => {
    try {
      await exportCsv()
      addToast({
        title: "CSV Export Ready",
        description: "Filtered records downloaded as CSV.",
        type: "success",
      })
    } catch {
      addToast({
        title: "Export failed",
        description: "Could not generate CSV at this time.",
        type: "error",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16313B] tracking-tight">
              Records
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DDF4E8] text-[#146152] border border-[#BEE8D4]">
              {total} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, filter, audit, and organize all structured workspace records.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchRecords()}
            title="Refresh records"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            title="Export filtered records"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/create-record")}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create Record
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <RecordSummaryCards records={records} total={total} />

      {/* Search & Filters */}
      <RecordFilters />

      {/* Table */}
      <RecordsTable
        onEditRecord={(rec) => setRecordToEdit(rec)}
        onDeleteRecord={(rec) => setRecordToDelete(rec)}
      />

      {/* Slide-out details drawer */}
      <RecordDetailsDrawer
        onEdit={(rec) => setRecordToEdit(rec)}
        onDelete={(rec) => setRecordToDelete(rec)}
      />

      {/* Delete confirmation dialog */}
      <RecordDeleteDialog
        record={recordToDelete}
        isOpen={!!recordToDelete}
        onClose={() => setRecordToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Edit modal */}
      <EditRecordModal
        record={recordToEdit}
        isOpen={!!recordToEdit}
        onClose={() => setRecordToEdit(null)}
        onSave={handleEditSave}
        isLoading={isUpdating}
      />
    </div>
  )
}
