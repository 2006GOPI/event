import { create } from "zustand"
import { assistantService } from "@/services/assistantService"
import { ChatMessage } from "@/types"

interface AssistantState {
  isOpen: boolean
  isMinimized: boolean
  messages: ChatMessage[]
  isTyping: boolean
  currentModel: string
  isLiveModel: boolean
  suggestions: string[]
  error: string | null

  openAssistant: () => void
  closeAssistant: () => void
  toggleAssistant: () => void
  toggleMinimize: () => void
  sendMessage: (text: string) => Promise<void>
  loadHistory: () => Promise<void>
  clearChat: () => void
}

const initialSuggestions = [
  "Summarize my workspace.",
  "Which records need attention?",
  "Help me create a record.",
  "Explain the current dashboard.",
]

export const useAssistantStore = create<AssistantState>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  messages: [
    {
      role: "assistant",
      content:
        "👋 Welcome to **ATLAS Assistant**! I can summarize your workspace, pinpoint urgent records, explain your dashboard metrics, or guide you through creating records. How can I help you today?",
      created_at: new Date().toISOString(),
    },
  ],
  isTyping: false,
  currentModel: "ATLAS Intelligence Engine",
  isLiveModel: false,
  suggestions: initialSuggestions,
  error: null,

  openAssistant: () => set({ isOpen: true, isMinimized: false }),
  closeAssistant: () => set({ isOpen: false }),
  toggleAssistant: () => set((state) => ({ isOpen: !state.isOpen, isMinimized: false })),
  toggleMinimize: () => set((state) => ({ isMinimized: !state.isMinimized })),

  sendMessage: async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      role: "user",
      content: text.trim(),
      created_at: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
      error: null,
    }))

    try {
      const response = await assistantService.sendMessage(text.trim())
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response.reply,
        created_at: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
        currentModel: response.model_name,
        isLiveModel: response.is_live_model,
        suggestions: response.suggestions.length > 0 ? response.suggestions : initialSuggestions,
      }))
    } catch (err: any) {
      set({
        isTyping: false,
        error: "Unable to reach the assistant service. Please check your network or try again.",
      })
    }
  },

  loadHistory: async () => {
    try {
      const history = await assistantService.getHistory()
      if (history.length > 0) {
        set({ messages: history })
      }
    } catch {}
  },

  clearChat: () =>
    set({
      messages: [
        {
          role: "assistant",
          content: "Conversation history cleared. What else can I assist you with?",
          created_at: new Date().toISOString(),
        },
      ],
      suggestions: initialSuggestions,
    }),
}))
