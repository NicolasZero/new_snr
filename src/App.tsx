import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { DashboardPage } from "@/pages/dashboard"
import { LoginPage } from "@/pages/login"
import { CallRecordsPage } from "@/pages/0800/records"
import { RegisterCallPage } from "@/pages/0800/register"
import {
  clearAuthenticatedSession,
  hasAuthenticatedSession,
} from "@/lib/auth"

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticatedSession)

  function handleLogout() {
    clearAuthenticatedSession()
    setIsAuthenticated(false)
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/inicio" replace />
          ) : (
            <LoginPage onAuthenticated={() => setIsAuthenticated(true)} />
          )
        }
      />
      <Route
        path="/inicio"
        element={
          isAuthenticated ? (
            <DashboardPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/0800/registrar"
        element={
          isAuthenticated ? (
            <RegisterCallPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/0800/registros"
        element={
          isAuthenticated ? (
            <CallRecordsPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/inicio" : "/login"} replace />}
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
