import React, { SelectHTMLAttributes, forwardRef } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-[#16313B]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 pr-9 text-sm text-[#16313B] transition-colors focus:border-[#219C85] focus:outline-none focus:ring-2 focus:ring-[#219C85]/20 disabled:bg-slate-50 disabled:text-slate-500",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    )
  }
)

Select.displayName = "Select"
