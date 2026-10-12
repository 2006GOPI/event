import React, { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ActivityTimelinePoint } from "@/types"
import { Skeleton } from "@/components/ui/Skeleton"

interface ActivityChartProps {
  data: ActivityTimelinePoint[]
  isLoading: boolean
}

export function ActivityChart({ data, isLoading }: ActivityChartProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d")

  if (isLoading) {
    return (
      <div className="p-6 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[#E2E8F0] bg-white/95 backdrop-blur-md p-3 shadow-elevation text-xs">
          <p className="font-semibold text-[#16313B] mb-1.5">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-500 capitalize">{entry.name}:</span>
                <span className="font-semibold text-[#16313B]">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-[#16313B]">Record Activity Velocity</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Throughput of newly created records versus verified completions.
          </p>
        </div>

        {/* Time-range toggle pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setRange("7d")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              range === "7d"
                ? "bg-white text-[#16313B] shadow-2xs"
                : "text-slate-500 hover:text-[#16313B]"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange("30d")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              range === "30d"
                ? "bg-white text-[#16313B] shadow-2xs"
                : "text-slate-500 hover:text-[#16313B]"
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No activity records recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#219C85" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#219C85" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="records_created"
                name="Created"
                stroke="#219C85"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCreated)"
              />
              <Area
                type="monotone"
                dataKey="records_completed"
                name="Completed"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompleted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
