import { create } from "zustand"
import { recordsService } from "@/services/recordsService"
import { RecordFilterParams, RecordItem } from "@/types"
import { RecordFormData } from "@/schemas/recordSchemas"
import { downloadCsv } from "@/utils/exportCsv"

interface RecordsState {
  records: RecordItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  isLoading: boolean
  error: string | null

  // Filters
  filters: RecordFilterParams

  // Selection & Details
  selectedIds: number[]
  activeRecord: RecordItem | null
  isDrawerOpen: boolean

  // Actions
  fetchRecords: (customParams?: Partial<RecordFilterParams>) => Promise<void>
  setFilter: (key: keyof RecordFilterParams, value: any) => void
  resetFilters: () => void
  toggleSelectRecord: (id: number) => void
  toggleSelectAll: () => void
  clearSelection: () => void
  openDrawer: (record: RecordItem) => void
  closeDrawer: () => void
  createRecord: (data: RecordFormData) => Promise<RecordItem>
  updateRecord: (id: number, data: Partial<RecordFormData>) => Promise<RecordItem>
  deleteRecord: (id: number) => Promise<void>
  bulkDelete: () => Promise<number>
  exportCsv: () => Promise<void>
}

const defaultFilters: RecordFilterParams = {
  search: "",
  status: "all",
  category: "all",
  priority: "all",
  sort_by: "updated_at",
  sort_order: "desc",
  page: 1,
  page_size: 10,
}

export const useRecordsStore = create<RecordsState>((set, get) => ({
  records: [],
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 1,
  isLoading: false,
  error: null,

  filters: defaultFilters,
  selectedIds: [],
  activeRecord: null,
  isDrawerOpen: false,

  fetchRecords: async (customParams = {}) => {
    set({ isLoading: true, error: null })
    const currentFilters = { ...get().filters, ...customParams }
    try {
      const response = await recordsService.getRecords(currentFilters)
      set({
        records: response.items,
        total: response.total,
        page: response.page,
        pageSize: response.page_size,
        totalPages: response.total_pages,
        filters: currentFilters,
        isLoading: false,
      })
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.detail || err.message || "Failed to load records.",
      })
    }
  },

  setFilter: (key, value) => {
    const updatedFilters = {
      ...get().filters,
      [key]: value,
      page: key === "page" ? value : 1, // Reset to page 1 on filter changes
    }
    set({ filters: updatedFilters })
    get().fetchRecords(updatedFilters)
  },

  resetFilters: () => {
    set({ filters: defaultFilters, selectedIds: [] })
    get().fetchRecords(defaultFilters)
  },

  toggleSelectRecord: (id: number) => {
    const current = get().selectedIds
    const next = current.includes(id) ? current.filter((i) => i !== id) : [...current, id]
    set({ selectedIds: next })
  },

  toggleSelectAll: () => {
    const { records, selectedIds } = get()
    if (selectedIds.length === records.length) {
      set({ selectedIds: [] })
    } else {
      set({ selectedIds: records.map((r) => r.id) })
    }
  },

  clearSelection: () => set({ selectedIds: [] }),

  openDrawer: (record) => set({ activeRecord: record, isDrawerOpen: true }),
  closeDrawer: () => set({ activeRecord: null, isDrawerOpen: false }),

  createRecord: async (data: RecordFormData) => {
    const newRecord = await recordsService.createRecord(data)
    get().fetchRecords()
    return newRecord
  },

  updateRecord: async (id: number, data: Partial<RecordFormData>) => {
    const updated = await recordsService.updateRecord(id, data)
    // Update local list and active record
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? updated : r)),
      activeRecord: state.activeRecord?.id === id ? updated : state.activeRecord,
    }))
    return updated
  },

  deleteRecord: async (id: number) => {
    await recordsService.deleteRecord(id)
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
      selectedIds: state.selectedIds.filter((i) => i !== id),
      activeRecord: state.activeRecord?.id === id ? null : state.activeRecord,
      isDrawerOpen: state.activeRecord?.id === id ? false : state.isDrawerOpen,
      total: Math.max(0, state.total - 1),
    }))
  },

  bulkDelete: async () => {
    const { selectedIds } = get()
    if (selectedIds.length === 0) return 0
    await recordsService.bulkDelete(selectedIds)
    const count = selectedIds.length
    set({ selectedIds: [] })
    get().fetchRecords()
    return count
  },

  exportCsv: async () => {
    const blob = await recordsService.exportCsv(get().filters)
    downloadCsv(blob, `atlas_records_${new Date().toISOString().slice(0, 10)}.csv`)
  },
}))
