import React from "react"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"
import { useUiStore } from "@/store/uiStore"
import { cn } from "@/utils/cn"

export function ToastContainer() {
  const { toasts, removeToast } = useUiStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        }

        const borderColors = {
          success: "border-emerald-200 bg-emerald-50/90",
          error: "border-red-200 bg-red-50/90",
          warning: "border-amber-200 bg-amber-50/90",
          info: "border-blue-200 bg-blue-50/90",
        }

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-elevation backdrop-blur-md transition-all animate-in slide-in-from-top-2 duration-200",
              borderColors[toast.type]
            )}
          >
            {icons[toast.type]}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-[#16313B] leading-tight">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-600 mt-1">
                  {typeof toast.description === "string"
                    ? toast.description
                    : Array.isArray(toast.description)
                    ? (toast.description as any[])
                        .map((d) => (typeof d === "object" ? d.msg || d.detail || JSON.stringify(d) : String(d)))
                        .join(" | ")
                    : typeof toast.description === "object"
                    ? JSON.stringify(toast.description)
                    : String(toast.description)}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
