import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { LoginPage } from "@/pages/LoginPage"

vi.mock("@/services/authService", () => ({
  authService: {
    login: vi.fn().mockRejectedValue(new Error("Incorrect email or password")),
    getMe: vi.fn().mockResolvedValue({ id: 1, email: "demo@atlasworkspace.io", full_name: "Demo User" }),
  },
}))

describe("LoginPage Component", () => {
  it("renders login form with email, password fields and buttons", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    expect(screen.getByText("Welcome back")).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in to workspace/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /use demo/i })).toBeInTheDocument()
  })

  it("validates required fields on empty submit", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const submitBtn = screen.getByRole("button", { name: /sign in to workspace/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it("fills demo credentials when Use Demo button is clicked", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const demoBtn = screen.getByRole("button", { name: /use demo/i })
    fireEvent.click(demoBtn)

    await waitFor(() => {
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
      expect(emailInput.value).toBe("demo@atlasworkspace.io")
    })
  })
})
