import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { StatusBreakdownItem } from "@/types"
import { Skeleton } from "@/components/ui/Skeleton"

interface StatusDonutChartProps {
  data: StatusBreakdownItem[]
  isLoading: boolean
}

export function StatusDonutChart({ data, isLoading }: StatusDonutChartProps) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-xl border border-[#E2E8F0] bg-white shadow-card space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-52 w-full rounded-full" />
      </div>
    )
  }

  // Filter out statuses with 0 count for clean visual presentation, or show default empty state
  const activeData = data.filter((item) => item.count > 0)
  const totalCount = data.reduce((acc, curr) => acc + curr.count, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-2.5 shadow-elevation text-xs">
          <p className="font-semibold text-[#16313B]">{item.status}</p>
          <p className="text-slate-500 mt-0.5">
            {item.count} records ({item.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 sm:p-6 shadow-card flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-[#16313B]">Status Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Breakdown of workload across active and closed states.
        </p>
      </div>

      <div className="relative h-52 w-full my-3 flex items-center justify-center">
        {totalCount === 0 ? (
          <div className="text-xs text-slate-400">No records available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={activeData.length > 0 ? activeData : [{ status: "Empty", count: 1, color: "#E2E8F0" }]}
                innerRadius={58}
                outerRadius={80}
                paddingAngle={3}
                dataKey="count"
                nameKey="status"
                stroke="none"
              >
                {activeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Center label */}
        {totalCount > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-[#16313B] leading-none">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Records
            </span>
          </div>
        )}
      </div>

      {/* Legend list */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 truncate">{item.status}</span>
            </div>
            <span className="font-semibold text-[#16313B] ml-2 shrink-0">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
