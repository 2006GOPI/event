import React, { InputHTMLAttributes, forwardRef } from "react"
import { Check } from "lucide-react"
import { cn } from "@/utils/cn"

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

    return (
      <label htmlFor={inputId} className="inline-flex items-center gap-2 cursor-pointer select-none">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            className={cn(
              "peer h-4 w-4 rounded border border-[#E2E8F0] bg-white text-[#219C85] focus:ring-2 focus:ring-[#219C85]/30 focus:outline-none transition-colors checked:bg-[#219C85] checked:border-[#219C85] cursor-pointer",
              className
            )}
            {...props}
          />
        </div>
        {label && <span className="text-sm text-[#16313B] font-medium">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"
