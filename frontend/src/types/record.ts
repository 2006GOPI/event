export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export type RecordPriority = "Low" | "Medium" | "High" | "Urgent"
export type RecordStatus = "Draft" | "Open" | "In Progress" | "Completed" | "Archived"

export interface RecordItem {
  id: number
  title: string
  description: string
  category: string
  priority: RecordPriority
  status: RecordStatus
  tags: string[]
  due_date: string | null
  checklist: ChecklistItem[]
  owner_id: number
  created_at: string
  updated_at: string
  owner?: {
    id: number
    full_name: string
    email: string
  }
}

export interface RecordListResponse {
  items: RecordItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface RecordFilterParams {
  search?: string
  status?: string
  category?: string
  priority?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
  page?: number
  page_size?: number
}
