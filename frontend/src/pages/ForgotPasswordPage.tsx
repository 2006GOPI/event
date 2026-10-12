import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/schemas/authSchemas"
import { authService } from "@/services/authService"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(data.email)
      setIsSubmitted(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-elevation p-8 sm:p-10">
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#219C85] hover:text-[#1B826F] mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
        <h2 className="text-2xl font-bold text-[#16313B] tracking-tight">Reset password</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instructions Sent
          </div>
          <p className="leading-relaxed">
            If an account is associated with this email address, we have dispatched a secure reset link. Check your inbox and spam folder.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="name@company.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Send Reset Instructions
          </Button>
        </form>
      )}
    </div>
  )
}
