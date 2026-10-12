import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { RecordSummaryCards } from "@/components/records/RecordSummaryCards"
import { RecordsTable } from "@/components/records/RecordsTable"
import { useRecordsStore } from "@/store/recordsStore"
import { RecordItem } from "@/types"

const mockRecords: RecordItem[] = [
  {
    id: 1,
    title: "Kubernetes Migration",
    description: "Upgrade clusters to Azure AKS",
    category: "Engineering",
    priority: "Urgent",
    status: "In Progress",
    tags: ["DevOps"],
    due_date: "2026-11-01T00:00:00Z",
    checklist: [{ id: "1", text: "Audit sizing", completed: true }],
    owner_id: 1,
    created_at: "2026-10-01T00:00:00Z",
    updated_at: "2026-10-05T00:00:00Z",
  },
  {
    id: 2,
    title: "Financial Audit Q3",
    description: "Reconcile Stripe payouts",
    category: "Finance",
    priority: "Low",
    status: "Completed",
    tags: ["Finance"],
    due_date: "2026-10-10T00:00:00Z",
    checklist: [],
    owner_id: 1,
    created_at: "2026-10-02T00:00:00Z",
    updated_at: "2026-10-06T00:00:00Z",
  },
]

describe("Records Management Components", () => {
  it("renders summary metric cards with accurate computed totals", () => {
    render(<RecordSummaryCards records={mockRecords} total={2} />)

    expect(screen.getByText("Total Records")).toBeInTheDocument()
    expect(screen.getByText("In Progress")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
    expect(screen.getByText("High Priority")).toBeInTheDocument()

    // 2 total, 1 in progress, 1 completed, 1 high/urgent
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("renders records table with data and badges", () => {
    useRecordsStore.setState({
      records: mockRecords,
      total: 2,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      isLoading: false,
    })

    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <BrowserRouter>
        <RecordsTable onEditRecord={onEdit} onDeleteRecord={onDelete} />
      </BrowserRouter>
    )

    expect(screen.getByText("Kubernetes Migration")).toBeInTheDocument()
    expect(screen.getByText("Financial Audit Q3")).toBeInTheDocument()
    expect(screen.getByText("Engineering")).toBeInTheDocument()
    expect(screen.getByText("Finance")).toBeInTheDocument()
    expect(screen.getByText("Urgent")).toBeInTheDocument()
  })

  it("renders empty state when no records are available", () => {
    useRecordsStore.setState({
      records: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      isLoading: false,
    })

    render(
      <BrowserRouter>
        <RecordsTable onEditRecord={vi.fn()} onDeleteRecord={vi.fn()} />
      </BrowserRouter>
    )

    expect(screen.getByText(/no records found/i)).toBeInTheDocument()
  })
})
