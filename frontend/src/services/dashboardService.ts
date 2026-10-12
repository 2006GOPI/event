import { request } from "./apiClient"
import {
  ActivityItem,
  ActivityTimelinePoint,
  DashboardOverview,
  DashboardSummary,
  StatusBreakdownItem,
} from "@/types"

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    return request<DashboardOverview>("/dashboard/overview")
  },

  async getSummary(): Promise<DashboardSummary> {
    return request<DashboardSummary>("/dashboard/summary")
  },

  async getActivity(): Promise<ActivityTimelinePoint[]> {
    return request<ActivityTimelinePoint[]>("/dashboard/activity")
  },

  async getStatusBreakdown(): Promise<StatusBreakdownItem[]> {
    return request<StatusBreakdownItem[]>("/dashboard/status-breakdown")
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    return request<ActivityItem[]>("/dashboard/recent-activity")
  },
}
