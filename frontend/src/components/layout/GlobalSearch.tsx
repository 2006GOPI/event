import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, FileText, ArrowRight, X } from "lucide-react"
import { useRecordsStore } from "@/store/recordsStore"
import { useUiStore } from "@/store/uiStore"
import { Dialog } from "@/components/ui/Dialog"

export function GlobalSearch() {
  const navigate = useNavigate()
  const { searchDialogOpen, setSearchDialogOpen } = useUiStore()
  const { records, openDrawer, setFilter } = useRecordsStore()
  const [searchTerm, setSearchTerm] = useState("")

  // Global Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchDialogOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setSearchDialogOpen])

  const filtered = searchTerm.trim()
    ? records.filter(
        (r) =>
          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : records.slice(0, 5)

  const handleSelectRecord = (record: any) => {
    setSearchDialogOpen(false)
    navigate("/records")
    openDrawer(record)
  }

  const handleSearchAll = () => {
    setSearchDialogOpen(false)
    setFilter("search", searchTerm)
    navigate("/records")
  }

  return (
    <>
      {/* Topbar input trigger */}
      <button
        onClick={() => setSearchDialogOpen(true)}
        className="flex items-center gap-2.5 w-48 md:w-64 lg:w-80 px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-slate-50/70 hover:bg-slate-100/80 text-slate-400 hover:text-slate-600 text-xs transition-colors text-left"
      >
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="flex-1 truncate">Search records, tasks...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-semibold text-slate-500 shadow-2xs">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      <Dialog
        isOpen={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  handleSearchAll()
                }
              }}
              placeholder="Search by title, category, or keyword..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-sm text-[#16313B] focus:bg-white focus:border-[#219C85] focus:outline-none focus:ring-2 focus:ring-[#219C85]/20 transition-all"
            />
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              {searchTerm ? "Search Results" : "Recent Records"}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No matching records found.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectRecord(item)}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-[#DDF4E8] text-[#219C85] flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-medium text-[#16313B] group-hover:text-[#219C85] truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {item.category} • {item.status} • {item.priority}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#219C85] shrink-0" />
                </div>
              ))
            )}
          </div>

          {searchTerm.trim() && (
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleSearchAll}
                className="text-xs text-[#219C85] hover:text-[#146152] font-semibold flex items-center gap-1"
              >
                View all results in Records table →
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  )
}
