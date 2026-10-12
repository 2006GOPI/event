import React from "react"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  steps: { id: number; title: string; subtitle: string }[]
  onStepClick: (stepId: number) => void
}

export function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-card">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep

          return (
            <React.Fragment key={step.id}>
              {/* Step item */}
              <button
                type="button"
                onClick={() => isCompleted && onStepClick(step.id)}
                disabled={!isCompleted && !isCurrent}
                className={`flex items-center gap-3 text-left transition-opacity ${
                  !isCompleted && !isCurrent ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                    isCompleted
                      ? "bg-[#219C85] text-white shadow-xs"
                      : isCurrent
                      ? "bg-[#DDF4E8] text-[#146152] border-2 border-[#219C85]"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
                </div>

                <div className="hidden sm:block">
                  <span
                    className={`text-xs font-bold block ${
                      isCurrent ? "text-[#219C85]" : "text-[#16313B]"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-400">{step.subtitle}</span>
                </div>
              </button>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 mx-3 sm:mx-6 h-0.5 transition-colors ${
                    step.id < currentStep ? "bg-[#219C85]" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
