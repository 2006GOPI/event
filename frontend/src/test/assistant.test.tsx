import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { FloatingAssistant } from "@/components/assistant/FloatingAssistant"
import { useAssistantStore } from "@/store/assistantStore"

describe("FloatingAssistant Component", () => {
  it("renders circular launcher button initially", () => {
    useAssistantStore.setState({ isOpen: false, isMinimized: false })

    render(<FloatingAssistant />)

    const launcherBtn = screen.getByRole("button", { name: /ask atlas ai/i })
    expect(launcherBtn).toBeInTheDocument()
  })

  it("opens chat panel when launcher is clicked", () => {
    useAssistantStore.setState({ isOpen: false, isMinimized: false })

    render(<FloatingAssistant />)

    const launcherBtn = screen.getByRole("button", { name: /ask atlas ai/i })
    fireEvent.click(launcherBtn)

    expect(screen.getByText("ATLAS AI Assistant")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/ask a question about your workspace/i)).toBeInTheDocument()
    expect(screen.getByText("Summarize my workspace.")).toBeInTheDocument()
  })

  it("minimizes chat panel when minimize button is clicked", () => {
    useAssistantStore.setState({ isOpen: true, isMinimized: false })

    render(<FloatingAssistant />)

    const minimizeBtn = screen.getByTitle(/minimize chat/i)
    fireEvent.click(minimizeBtn)

    const { isMinimized } = useAssistantStore.getState()
    expect(isMinimized).toBe(true)
  })
})
