import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Reports from './pages/Reports'
import Budgets from './pages/Budgets'
import Settings from './pages/Settings'
import { AppShell } from './components/layout/AppShell'
import type { ReactNode } from 'react'

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVATE ROUTE
   Protects routes that require authentication
═══════════════════════════════════════════════════════════════════════════ */

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP ROUTER
   Main routing configuration with AppShell layout for authenticated pages
═══════════════════════════════════════════════════════════════════════════ */

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No AppShell */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - With AppShell */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppShell>
                <Dashboard />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <AppShell>
                <Transactions />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AppShell>
                <Reports />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <AppShell>
                <Budgets />
              </AppShell>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AppShell>
                <Settings />
              </AppShell>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}