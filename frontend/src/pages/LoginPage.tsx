import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight } from "lucide-react"
import { loginSchema, LoginFormData } from "@/schemas/authSchemas"
import { useAuthStore } from "@/store/authStore"
import { useUiStore } from "@/store/uiStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Checkbox } from "@/components/ui/Checkbox"

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const { addToast } = useUiStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError()
      await login(data)
      addToast({
        title: "Welcome back!",
        description: "You have successfully signed in to ATLAS Workspace.",
        type: "success",
      })
      navigate("/dashboard")
    } catch {
      // Error is stored in authStore
    }
  }

  const fillDemoAccount = () => {
    setValue("email", "demo@atlasworkspace.io", { shouldValidate: true })
    setValue("password", "AtlasDemo2026!", { shouldValidate: true })
    clearError()
    addToast({
      title: "Demo credentials filled",
      description: "Click 'Sign in to Workspace' to explore the seeded demo workspace.",
      type: "info",
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-elevation p-8 sm:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#16313B] tracking-tight">Welcome back</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sign in to your ATLAS workspace to manage records and tasks.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mb-6 p-3 rounded-xl bg-[#DDF4E8]/70 border border-[#BEE8D4] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="w-4 h-4 text-[#219C85] shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-[#146152]">Demo Workspace Available</span>
            <p className="text-[11px] text-[#16313B]/70">Explore pre-seeded records & metrics</p>
          </div>
        </div>
        <Button
          type="button"
          variant="mint"
          size="sm"
          onClick={fillDemoAccount}
          className="text-xs py-1 px-2.5 shrink-0"
        >
          Use Demo
        </Button>
      </div>

      {/* Server error alert */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex items-center justify-between pt-1">
          <Checkbox label="Remember me" {...register("remember_me")} />
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-[#219C85] hover:text-[#1B826F] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Sign in to Workspace <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
        <p className="text-xs text-slate-500">
          Don't have an ATLAS account yet?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#219C85] hover:text-[#1B826F] transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
