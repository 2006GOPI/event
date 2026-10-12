import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowRight } from "lucide-react"
import { registerSchema, RegisterFormData } from "@/schemas/authSchemas"
import { useAuthStore } from "@/store/authStore"
import { useUiStore } from "@/store/uiStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()
  const { addToast } = useUiStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError()
      await registerUser(data)
      addToast({
        title: "Account created!",
        description: "Welcome to ATLAS Workspace. Your account is ready.",
        type: "success",
      })
      navigate("/dashboard")
    } catch {}
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-elevation p-8 sm:p-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#16313B] tracking-tight">Create your account</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join your organization on ATLAS Workspace.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="e.g. Alex Mercer"
          leftIcon={<UserIcon className="w-4 h-4" />}
          error={errors.full_name?.message}
          {...register("full_name")}
        />

        <Input
          label="Work email"
          type="email"
          placeholder="name@company.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Minimum 8 characters"
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

        <Input
          label="Confirm password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Create Account <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#219C85] hover:text-[#1B826F] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
