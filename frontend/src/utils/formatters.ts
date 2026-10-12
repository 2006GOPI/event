export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  try {
    const d = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d)
  } catch {
    return dateString
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  try {
    const d = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(d)
  } catch {
    return dateString
  }
}

export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return ""
  try {
    const d = new Date(dateString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)

    if (diffSec < 60) return "just now"
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`
    return formatDate(dateString)
  } catch {
    return ""
  }
}

export function getStatusColor(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case "Open":
      return { bg: "bg-[#DDF4E8]", text: "text-[#146152]", border: "border-[#BEE8D4]", dot: "bg-[#219C85]" }
    case "In Progress":
      return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" }
    case "Completed":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" }
    case "Draft":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" }
    case "Archived":
      return { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" }
  }
}

export function getPriorityBadge(priority: string): { bg: string; text: string; border: string } {
  switch (priority) {
    case "Urgent":
      return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" }
    case "High":
      return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" }
    case "Medium":
      return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" }
    case "Low":
      return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" }
    default:
      return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" }
  }
}
