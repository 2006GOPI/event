import React, { HTMLAttributes } from "react"
import { cn } from "@/utils/cn"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "mint" | "blue" | "emerald" | "amber" | "red" | "outline"
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    mint: "bg-[#DDF4E8] text-[#146152] border-[#BEE8D4]",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    outline: "bg-white text-slate-600 border-[#E2E8F0]",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
