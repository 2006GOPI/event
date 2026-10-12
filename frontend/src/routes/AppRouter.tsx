import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthLayout } from "@/layouts/AuthLayout"
import { WorkspaceLayout } from "@/layouts/WorkspaceLayout"
import { ProtectedRoute } from "@/routes/ProtectedRoute"

import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { RecordsPage } from "@/pages/RecordsPage"
import { CreateRecordPage } from "@/pages/CreateRecordPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export function AppRouter() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Authenticated Workspace Routes */}
      <Route
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/create-record" element={<CreateRecordPage />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
