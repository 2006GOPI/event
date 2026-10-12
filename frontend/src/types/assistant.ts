export interface ChatMessage {
  id?: number | string
  role: "user" | "assistant" | "system"
  content: string
  created_at?: string
  conversation_id?: string
}

export interface ChatResponse {
  reply: string
  role: "assistant"
  conversation_id: string
  is_live_model: boolean
  model_name: string
  suggestions: string[]
}
