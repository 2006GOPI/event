import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Trash2,
  Calendar,
  Tag as TagIcon,
  CheckSquare,
  AlertCircle,
  Save,
  HelpCircle,
} from "lucide-react"
import { recordFormSchema, RecordFormData } from "@/schemas/recordSchemas"
import { useRecordsStore } from "@/store/recordsStore"
import { useUiStore } from "@/store/uiStore"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Select } from "@/components/ui/Select"
import { Dialog } from "@/components/ui/Dialog"
import { StepIndicator } from "@/components/create-record/StepIndicator"
import { LivePreviewSidebar } from "@/components/create-record/LivePreviewSidebar"
import { formatDate } from "@/utils/formatters"

export function CreateRecordPage() {
  const navigate = useNavigate()
  const { createRecord } = useRecordsStore()
  const { addToast } = useUiStore()
  const { user } = useAuthStore()

  const [currentStep, setCurrentStep] = useState(1)
  const [tagInput, setTagInput] = useState("")
  const [newChecklistText, setNewChecklistText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const steps = [
    { id: 1, title: "Basic Information", subtitle: "Title & Scope" },
    { id: 2, title: "Classification", subtitle: "Priority & Tasks" },
    { id: 3, title: "Review & Submit", subtitle: "Final Validation" },
  ]

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors, isDirty },
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Engineering",
      priority: "Medium",
      status: "Open",
      tags: ["Sprint-4"],
      due_date: "",
      checklist: [
        { id: "1", text: "Architecture design & schema review", completed: false },
        { id: "2", text: "Implementation & automated tests", completed: false },
      ],
    },
    mode: "onChange",
  })

  const { fields: checklistFields, append: appendChecklist, remove: removeChecklist } =
    useFieldArray({
      control,
      name: "checklist",
    })

  const formData = watch()

  // Tag management
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return
    e.preventDefault()
    if (!tagInput.trim()) return

    const currentTags = formData.tags || []
    if (!currentTags.includes(tagInput.trim())) {
      setValue("tags", [...currentTags, tagInput.trim()])
    }
    setTagInput("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData.tags || []
    setValue(
      "tags",
      currentTags.filter((t) => t !== tagToRemove)
    )
  }

  // Checklist management
  const handleAddChecklistItem = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return
    e.preventDefault()
    if (!newChecklistText.trim()) return

    appendChecklist({
      id: Math.random().toString(36).substring(2, 9),
      text: newChecklistText.trim(),
      completed: false,
    })
    setNewChecklistText("")
  }

  // Stepper navigation with validation
  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(["title", "description", "category"])
      if (!isValid) return
    }
    if (currentStep === 2) {
      const isValid = await trigger(["priority", "status", "tags", "checklist"])
      if (!isValid) return
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Submission handler
  const onSubmit = async (data: RecordFormData) => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const payload: RecordFormData = {
        ...data,
        due_date: data.due_date && data.due_date.trim() ? data.due_date.trim() : null,
      }
      await createRecord(payload)
      addToast({
        title: "Record created successfully",
        description: `Record '${payload.title}' has been persisted to the database.`,
        type: "success",
      })
      navigate("/records")
    } catch (err: any) {
      addToast({
        title: "Creation failed",
        description: err.detail || err.message || "Failed to create record.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    const currentTitle = formData.title?.trim()
    if (!currentTitle) {
      setValue("title", "Untitled Draft Record")
    }
    setValue("status", "Draft")
    handleSubmit(onSubmit)()
  }

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelDialog(true)
    } else {
      navigate("/records")
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={handleCancelClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#219C85] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Records
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16313B] tracking-tight">
            Create New Record
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Define basic properties, classify workflow priorities, and verify before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={isSubmitting}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Draft
          </Button>
        </div>
      </div>

      {/* Stepper Indicator */}
      <StepIndicator
        currentStep={currentStep}
        steps={steps}
        onStepClick={(s) => setCurrentStep(s)}
      />

      {/* Two-Column Form and Live Contextual Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Cols: Active Step Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-card p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* STEP 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-[#16313B]">Step 1 — Basic Information</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter identifying record title and general project details.
                    </p>
                  </div>

                  <Input
                    label="Record Title *"
                    placeholder="e.g. Enterprise Infrastructure Migration Q4"
                    error={errors.title?.message}
                    helperText="A clear, actionable title for team visibility (minimum 3 characters)"
                    {...register("title")}
                  />

                  <Textarea
                    label="Description"
                    placeholder="Outline key objectives, deliverables, and context..."
                    rows={4}
                    error={errors.description?.message}
                    helperText="Describe what is required to complete or audit this record"
                    {...register("description")}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Category *"
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
                      error={errors.category?.message}
                      {...register("category")}
                    />

                    <Input
                      label="Owner / Responsible User"
                      value={user?.full_name || "Alex Mercer"}
                      disabled
                      helperText="Automatically assigned to current authenticated user"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Optional Target Due Date"
                      type="date"
                      leftIcon={<Calendar className="w-4 h-4" />}
                      error={errors.due_date?.message}
                      {...register("due_date")}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Classification */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-[#16313B]">Step 2 — Classification & Tasks</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Assign urgency, lifecycle state, tags, and action checklist items.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Priority *"
                      options={[
                        { value: "Low", label: "Low (P3)" },
                        { value: "Medium", label: "Medium (P2)" },
                        { value: "High", label: "High (P1)" },
                        { value: "Urgent", label: "Urgent (P0 - Blocker)" },
                      ]}
                      error={errors.priority?.message}
                      {...register("priority")}
                    />

                    <Select
                      label="Lifecycle Status *"
                      options={[
                        { value: "Open", label: "Open" },
                        { value: "In Progress", label: "In Progress" },
                        { value: "Completed", label: "Completed" },
                        { value: "Draft", label: "Draft" },
                        { value: "Archived", label: "Archived" },
                      ]}
                      error={errors.status?.message}
                      {...register("status")}
                    />
                  </div>

                  {/* Interactive Tags Editor */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#16313B]">
                      Workspace Tags
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TagIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Type tag and press Enter (e.g. SOC2, Security)..."
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
                        />
                      </div>
                      <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                        Add Tag
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formData.tags?.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DDF4E8] text-[#146152] border border-[#BEE8D4]"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-red-600 transition-colors ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Checklist Editor */}
                  <div className="space-y-3 pt-2">
                    <label className="block text-sm font-medium text-[#16313B]">
                      Task Checklist ({checklistFields.length} items)
                    </label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        onKeyDown={handleAddChecklistItem}
                        placeholder="Add a required milestone or task..."
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddChecklistItem}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Task
                      </Button>
                    </div>

                    <div className="space-y-2 mt-2">
                      {checklistFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-500 font-bold flex items-center justify-center text-[10px]">
                              {index + 1}
                            </span>
                            <span className="font-medium text-[#16313B]">{field.text}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeChecklist(index)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Review and Submit */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-[#16313B]">Step 3 — Review and Submit</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify all attributes before committing this record to the persistent database.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="divide-y divide-slate-100 rounded-xl border border-[#E2E8F0] bg-slate-50/40 p-5 space-y-4">
                    <div className="flex items-start justify-between pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Title & Category
                        </span>
                        <h3 className="text-base font-bold text-[#16313B] mt-0.5">
                          {formData.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{formData.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-xs font-semibold text-[#219C85] hover:text-[#146152]"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Category</span>
                        <span className="font-semibold text-[#16313B]">{formData.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Priority</span>
                        <span className="font-semibold text-[#16313B]">{formData.priority}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Status</span>
                        <span className="font-semibold text-[#16313B]">{formData.status}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Due Date</span>
                        <span className="font-semibold text-[#16313B]">
                          {formatDate(formData.due_date)}
                        </span>
                      </div>
                    </div>

                    {formData.tags && formData.tags.length > 0 && (
                      <div className="py-3">
                        <span className="text-slate-400 text-[11px] block mb-1.5">Tags</span>
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#DDF4E8] text-[#146152]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.checklist && formData.checklist.length > 0 && (
                      <div className="pt-3">
                        <span className="text-slate-400 text-[11px] block mb-1.5">
                          Checklist Tasks ({formData.checklist.length})
                        </span>
                        <ul className="space-y-1 text-xs">
                          {formData.checklist.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#219C85]" />
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Navigation Actions Footer */}
              <div className="mt-8 pt-5 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={currentStep === 1 ? handleCancelClick : handlePrevStep}
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  {currentStep === 1 ? "Cancel" : "Back"}
                </Button>

                <div className="flex items-center gap-2">
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={handleNextStep}
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isSubmitting}
                      className="shadow-sm"
                    >
                      <Check className="w-4 h-4 mr-1.5" /> Submit Record
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right 1-Col: Live Contextual Panel */}
        <div className="lg:col-span-1">
          <LivePreviewSidebar formData={formData} />
        </div>
      </div>

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        maxWidth="sm"
      >
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#16313B]">Discard changes?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You have unsaved changes in this record form. Are you sure you want to leave without saving?
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCancelDialog(false)}
            >
              Continue Editing
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setShowCancelDialog(false)
                navigate("/records")
              }}
            >
              Discard & Exit
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
