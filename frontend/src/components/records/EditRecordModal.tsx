import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { RecordItem } from "@/types"

interface EditRecordModalProps {
  record: RecordItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (id: number, data: any) => Promise<void>
  isLoading: boolean
}

export function EditRecordModal({
  record,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: EditRecordModalProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "Engineering",
      priority: "Medium",
      status: "Open",
    },
  })

  useEffect(() => {
    if (record) {
      reset({
        title: record.title,
        description: record.description,
        category: record.category,
        priority: record.priority,
        status: record.status,
      })
    }
  }, [record, reset])

  if (!record) return null

  const onSubmit = async (data: any) => {
    await onSave(record.id, data)
    onClose()
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit Record" maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Record Title"
          required
          {...register("title", { required: true })}
        />

        <Textarea
          label="Description"
          rows={3}
          {...register("description")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Category"
            options={[
              { value: "Engineering", label: "Engineering" },
              { value: "Design", label: "Design" },
              { value: "Product", label: "Product" },
              { value: "Finance", label: "Finance" },
              { value: "Operations", label: "Operations" },
              { value: "Legal", label: "Legal" },
              { value: "Strategy", label: "Strategy" },
              { value: "General", label: "General" },
            ]}
            {...register("category")}
          />

          <Select
            label="Priority"
            options={[
              { value: "Low", label: "Low" },
              { value: "Medium", label: "Medium" },
              { value: "High", label: "High" },
              { value: "Urgent", label: "Urgent" },
            ]}
            {...register("priority")}
          />

          <Select
            label="Status"
            options={[
              { value: "Open", label: "Open" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "Draft", label: "Draft" },
              { value: "Archived", label: "Archived" },
            ]}
            {...register("status")}
          />
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
