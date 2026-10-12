import React from "react"
import { AlertTriangle } from "lucide-react"
import { Dialog } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { RecordItem } from "@/types"

interface RecordDeleteDialogProps {
  record: RecordItem | null
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isLoading: boolean
}

export function RecordDeleteDialog({
  record,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RecordDeleteDialogProps) {
  if (!record) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-[#16313B]">Delete Record?</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-[#16313B]">"{record.title}"</span>?
            This action cannot be undone and will remove all checklist items and audit history.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="secondary" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading}>
            Yes, Delete Record
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
