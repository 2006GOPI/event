import React from "react"
import { Outlet } from "react-router-dom"
import { Compass, Hammer, BarChart2, CheckCircle2, ShieldCheck, Zap, Users } from "lucide-react"
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant"
import { ToastContainer } from "@/components/ui/Toast"

export function AuthLayout() {
  const features = [
    {
      title: "Plan",
      desc: "Structured workflows & due-date tracking",
      icon: Compass,
    },
    {
      title: "Build",
      desc: "Multi-step classification & task checklists",
      icon: Hammer,
    },
    {
      title: "Analyze",
      desc: "Real-time completion metrics & audit logs",
      icon: BarChart2,
    },
    {
      title: "Solve",
      desc: "Instant AI intelligence for records resolution",
      icon: CheckCircle2,
    },
  ]

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7FAF9]">
      {/* Left Product Introduction Section */}
      <div className="lg:w-1/2 bg-gradient-to-br from-[#DDF4E8] via-[#EAF7F0] to-[#F7FAF9] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#BEE8D4]/60 relative overflow-hidden">
        {/* Decorative subtle background shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#219C85]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#219C85]/8 rounded-full blur-2xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#219C85] text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-[#219C85]/20">
              A
            </div>
            <div>
              <span className="font-extrabold text-xl text-[#16313B] tracking-tight">ATLAS</span>
              <span className="block text-[11px] font-semibold text-[#219C85] tracking-widest uppercase -mt-1">
                Workspace
              </span>
            </div>
          </div>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-[#146152] border border-[#BEE8D4] mb-4 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-[#219C85]" /> Next-Gen Enterprise SaaS
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#16313B] tracking-tight leading-tight">
              One Platform for Every Challenge
            </h1>
            <p className="mt-3 text-sm text-[#16313B]/80 leading-relaxed">
              Unify your records, projects, checklists, and operational workflows into a high-speed workspace designed for teams who demand clarity and execution.
            </p>
          </div>
        </div>

        {/* 4 Feature Cards: Plan, Build, Analyze, Solve */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 max-w-lg">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-white/80 shadow-card hover:shadow-elevation transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#DDF4E8] text-[#219C85] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-[#16313B]">{f.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{f.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Trust & compliance footer */}
        <div className="relative z-10 pt-6 border-t border-[#BEE8D4]/60 flex flex-wrap items-center gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#219C85]" />
            <span>SOC 2 & Argon2 Security</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#219C85]" />
            <span>Role-Based Ownership</span>
          </div>
        </div>
      </div>

      {/* Right Form Container Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Floating AI Assistant launcher on login page */}
      <FloatingAssistant />
    </div>
  )
}
