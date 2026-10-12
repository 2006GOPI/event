import React, { useState, useRef, useEffect } from "react"
import {
  Bot,
  X,
  Minimize2,
  Maximize2,
  Send,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import { useAssistantStore } from "@/store/assistantStore"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/utils/cn"

export function FloatingAssistant() {
  const {
    isOpen,
    isMinimized,
    messages,
    isTyping,
    currentModel,
    isLiveModel,
    suggestions,
    error,
    openAssistant,
    closeAssistant,
    toggleMinimize,
    sendMessage,
    clearChat,
  } = useAssistantStore()

  const { isAuthenticated } = useAuthStore()
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping, isOpen, isMinimized])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, isMinimized])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim() || isTyping) return
    const text = inputText
    setInputText("")
    await sendMessage(text)
  }

  const handleSuggestionClick = (prompt: string) => {
    sendMessage(prompt)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded / Minimized Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "mb-4 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-white shadow-elevation border border-[#E2E8F0] overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in slide-in-from-bottom-4",
            isMinimized ? "h-14" : "h-[540px] max-h-[80vh]"
          )}
          role="dialog"
          aria-label="ATLAS AI Assistant"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#DDF4E8]/60 border-b border-[#BEE8D4]/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#219C85] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-xs text-[#16313B]">ATLAS AI Assistant</h3>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded-full",
                      isLiveModel
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-[#219C85]/15 text-[#146152]"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#219C85] animate-pulse" />
                    {isLiveModel ? "Live AI" : "Local Engine"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate" title={currentModel}>
                  {currentModel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title="Clear conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleMinimize}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={closeAssistant}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                title="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (when not minimized) */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user"
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex gap-2.5 max-w-[88%] text-xs leading-relaxed",
                        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-md bg-[#219C85] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap shadow-xs",
                          isUser
                            ? "bg-[#219C85] text-white rounded-br-xs"
                            : "bg-white text-[#16313B] border border-[#E2E8F0] rounded-bl-xs"
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                    <div className="w-6 h-6 rounded-md bg-[#219C85]/20 text-[#219C85] flex items-center justify-center shrink-0">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <span>Analyzing workspace records...</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts Pills */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 scrollbar-none">
                {suggestions.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#DDF4E8]/80 text-[#146152] hover:bg-[#DDF4E8] border border-[#BEE8D4] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question about your workspace..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E2E8F0] bg-slate-50/50 text-[#16313B] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#219C85] focus:ring-2 focus:ring-[#219C85]/20"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2 rounded-xl bg-[#219C85] text-white hover:bg-[#1B826F] disabled:opacity-40 transition-colors shrink-0 shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Circular Floating Launcher Button */}
      <button
        onClick={openAssistant}
        className={cn(
          "group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#219C85] text-white shadow-elevation hover:bg-[#1B826F] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#219C85]/30",
          isOpen && !isMinimized && "hidden"
        )}
        aria-label="Ask ATLAS AI"
      >
        <Bot className="w-6 h-6 transition-transform group-hover:rotate-6" />

        {/* Pulse indicator */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DDF4E8] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DDF4E8] border-2 border-[#219C85]" />
        </span>

        {/* Tooltip */}
        <span className="absolute right-15 px-2.5 py-1 rounded-lg bg-[#16313B] text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md">
          Ask ATLAS AI
        </span>
      </button>
    </div>
  )
}
