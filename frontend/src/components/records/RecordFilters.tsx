import React from "react"
import { Search, Filter, RotateCcw } from "lucide-react"
import { useRecordsStore } from "@/store/recordsStore"

export function RecordFilters() {
  const { filters, setFilter, resetFilters } = useRecordsStore()

  const categories = [
    "all",
    "Engineering",
    "Design",
    "Product",
    "Finance",
    "Operations",
    "Legal",
    "Strategy",
    "General",
  ]

  const statuses = ["all", "Open", "In Progress", "Completed", "Draft", "Archived"]
  const priorities = ["all", "Low", "Medium", "High", "Urgent"]

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.priority !== "all"

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-card space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search by title, description, or keyword..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-slate-50/50 text-[#16313B] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20 transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-40">
          <select
            value={filters.status || "all"}
            onChange={(e) => setFilter("status", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#16313B] focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
          >
            <option value="all">Status: All</option>
            {statuses.filter((s) => s !== "all").map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-40">
          <select
            value={filters.category || "all"}
            onChange={(e) => setFilter("category", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#16313B] focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
          >
            <option value="all">Category: All</option>
            {categories.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="w-full sm:w-36">
          <select
            value={filters.priority || "all"}
            onChange={(e) => setFilter("priority", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#16313B] focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
          >
            <option value="all">Priority: All</option>
            {priorities.filter((p) => p !== "all").map((p) => (
              <option key={p} value={p}>
                Priority: {p}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full sm:w-40">
          <select
            value={`${filters.sort_by || "updated_at"}-${filters.sort_order || "desc"}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-")
              setFilter("sort_by", by)
              setFilter("sort_order", order)
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#16313B] focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
          >
            <option value="updated_at-desc">Sort: Recently Updated</option>
            <option value="created_at-desc">Sort: Newest Created</option>
            <option value="title-asc">Sort: Title (A-Z)</option>
            <option value="priority-desc">Sort: Priority</option>
          </select>
        </div>

        {/* Reset button if filtered */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>
    </div>
  )
}
