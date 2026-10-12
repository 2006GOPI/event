export interface MetricChange {
  value: number
  is_positive: boolean
  label: string
}

export interface DashboardSummary {
  total_records: number
  active_tasks: number
  completed_items: number
  completion_rate: number
  total_records_change: MetricChange
  active_tasks_change: MetricChange
  completed_items_change: MetricChange
  completion_rate_change: MetricChange
}

export interface StatusBreakdownItem {
  status: string
  count: number
  percentage: number
  color: string
}

export interface ActivityTimelinePoint {
  date: string
  records_created: number
  records_completed: number
  total_activity: number
}

export interface ActivityItem {
  id: number
  user_id: number
  record_id?: number | null
  action_type: string
  description: string
  action_metadata: Record<string, any>
  created_at: string
}

export interface DashboardOverview {
  summary: DashboardSummary
  status_breakdown: StatusBreakdownItem[]
  activity_timeline: ActivityTimelinePoint[]
  recent_activities: ActivityItem[]
}
