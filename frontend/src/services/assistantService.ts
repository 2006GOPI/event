import { request } from "./apiClient"
import { ChatMessage, ChatResponse } from "@/types"

export const assistantService = {
  async sendMessage(message: string, conversation_id = "default"): Promise<ChatResponse> {
    return request<ChatResponse>("/assistant/chat", {
      method: "POST",
      body: JSON.stringify({ message, conversation_id }),
    })
  },

  async getHistory(conversation_id = "default"): Promise<ChatMessage[]> {
    return request<ChatMessage[]>("/assistant/history", {
      params: { conversation_id },
    })
  },
}
