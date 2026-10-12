import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { CreateRecordPage } from "@/pages/CreateRecordPage"

vi.mock("@/services/recordsService", () => ({
  recordsService: {
    createRecord: vi.fn().mockResolvedValue({ id: 99, title: "New Unit Test Record" }),
  },
}))

describe("CreateRecordPage Component", () => {
  it("renders Step 1 form fields and live preview sidebar", () => {
    render(
      <BrowserRouter>
        <CreateRecordPage />
      </BrowserRouter>
    )

    expect(screen.getByText("Step 1 — Basic Information")).toBeInTheDocument()
    expect(screen.getByLabelText(/record title \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category \*/i)).toBeInTheDocument()

    // Live preview sidebar
    expect(screen.getByText("Live Record Preview")).toBeInTheDocument()
    expect(screen.getByText("Record Readiness")).toBeInTheDocument()
  })

  it("advances to Step 2 when valid title is entered and Continue is clicked", async () => {
    render(
      <BrowserRouter>
        <CreateRecordPage />
      </BrowserRouter>
    )

    const titleInput = screen.getByLabelText(/record title \*/i)
    fireEvent.change(titleInput, { target: { value: "Migrate Payment Gateway to Stripe" } })

    const continueBtn = screen.getByRole("button", { name: /continue/i })
    fireEvent.click(continueBtn)

    await waitFor(() => {
      expect(screen.getByText("Step 2 — Classification & Tasks")).toBeInTheDocument()
      expect(screen.getByLabelText(/priority \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/lifecycle status \*/i)).toBeInTheDocument()
    })
  })
})
