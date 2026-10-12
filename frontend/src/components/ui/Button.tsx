import React, { ButtonHTMLAttributes, forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "mint"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"

    const variants = {
      primary:
        "bg-[#219C85] text-white hover:bg-[#1B826F] focus:ring-[#219C85] shadow-sm hover:shadow",
      secondary:
        "bg-white text-[#16313B] border border-[#E2E8F0] hover:bg-slate-50 focus:ring-slate-300 shadow-sm",
      outline:
        "border border-[#219C85] text-[#219C85] hover:bg-[#DDF4E8]/50 focus:ring-[#219C85]",
      ghost:
        "text-[#16313B] hover:bg-slate-100 hover:text-[#16313B] focus:ring-slate-200",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
      mint:
        "bg-[#DDF4E8] text-[#146152] hover:bg-[#c9eed9] focus:ring-[#219C85] font-semibold",
    }

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-5 py-2.5 gap-2.5",
      icon: "p-2 w-9 h-9 justify-center",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
