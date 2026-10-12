import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, FileText, ArrowRight, Sparkles } from "lucide-react"
import { dashboardService } from "@/services/dashboardService"
import { recordsService } from "@/services/recordsService"
import { DashboardOverview, RecordItem } from "@/types"
import { Button } from "@/components/ui/Button"
import { MetricCards } from "@/components/dashboard/MetricCards"
import { ActivityChart } from "@/components/dashboard/ActivityChart"
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart"
import { RecentActivityList } from "@/components/dashboard/RecentActivityList"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { UpcomingTasksWidget } from "@/components/dashboard/UpcomingTasksWidget"

export function DashboardPage() {
  const navigate = useNavigate()
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [records, setRecords] = useState<RecordItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [dashData, recData] = await Promise.all([
          dashboardService.getOverview(),
          recordsService.getRecords({ page: 1, page_size: 10 }),
        ])
        setOverview(dashData)
        setRecords(recData.items)
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-[#BEE8D4]/80 bg-gradient-to-r from-[#DDF4E8] via-[#E8F8F0] to-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/80 text-[#146152] border border-[#BEE8D4] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#219C85]" /> Overview & Metrics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16313B] tracking-tight">
            Your workspace, organized.
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#16313B]/80 leading-relaxed">
            Monitor real-time task progression, priority backlogs, and team execution metrics across your organization.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/create-record")}
            className="shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Record
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate("/records")}
          >
            <FileText className="w-4 h-4 mr-1.5" /> View Records
          </Button>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#219C85]/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Summary Metric Cards */}
      <MetricCards summary={overview?.summary ?? null} isLoading={isLoading} />

      {/* Working Quick Actions */}
      <QuickActions />

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart
            data={overview?.activity_timeline ?? []}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <StatusDonutChart
            data={overview?.status_breakdown ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Recent Activity and Upcoming Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityList
            activities={overview?.recent_activities ?? []}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <UpcomingTasksWidget
            records={records}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
