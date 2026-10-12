import { create } from "zustand"

export interface ToastItem {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
}

interface UiState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
  searchDialogOpen: boolean
  toasts: ToastItem[]
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  setSearchDialogOpen: (open: boolean) => void
  addToast: (toast: Omit<ToastItem, "id">) => void
  removeToast: (id: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  searchDialogOpen: false,
  toasts: [],

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  setSearchDialogOpen: (searchDialogOpen) => set({ searchDialogOpen }),

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { ...toast, id }
    set((s) => ({ toasts: [...s.toasts, newToast] }))

    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4500)
  },

  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
