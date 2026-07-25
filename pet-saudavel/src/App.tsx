import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import { useAuth } from "./context/AuthContext"
import { Spinner } from "./components/ui"

import Login from "./pages/Login"
import Home from "./pages/Home"
import Pets from "./pages/Pets"
import PetForm from "./pages/PetForm"
import PetDetail from "./pages/PetDetail"
import EmergencyCard from "./pages/EmergencyCard"
import SOS from "./pages/SOS"
import SOSDetail from "./pages/SOSDetail"
import GuiaDetail from "./pages/GuiaDetail"
import Library from "./pages/Library"
import Account from "./pages/Account"
import Privacy from "./pages/Privacy"

function FullscreenLoader() {
  return (
    <div className="flex min-h-full items-center justify-center bg-parchment">
      <Spinner size={36} />
    </div>
  )
}

function Protected({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <FullscreenLoader />
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />
  return <>{children}</>
}

export default function App() {
  const { session, loading } = useAuth()

  return (
    <Routes>
      {/* Público */}
      <Route
        path="/login"
        element={loading ? <FullscreenLoader /> : session ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/privacidade" element={<Privacy />} />

      {/* Protegido */}
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="/pets" element={<Protected><Pets /></Protected>} />
      <Route path="/pets/novo" element={<Protected><PetForm /></Protected>} />
      <Route path="/pets/:id/editar" element={<Protected><PetForm /></Protected>} />
      <Route path="/pets/:id" element={<Protected><PetDetail /></Protected>} />
      <Route path="/pets/:id/cartao" element={<Protected><EmergencyCard /></Protected>} />
      <Route path="/sos" element={<Protected><SOS /></Protected>} />
      <Route path="/sos/guia/:slug" element={<Protected><GuiaDetail /></Protected>} />
      <Route path="/sos/:slug" element={<Protected><SOSDetail /></Protected>} />
      <Route path="/biblioteca" element={<Protected><Library /></Protected>} />
      <Route path="/conta" element={<Protected><Account /></Protected>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
