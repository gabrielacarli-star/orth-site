import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Suspense, lazy, type ReactNode } from "react"
import { useAuth } from "./context/AuthContext"
import { Spinner } from "./components/ui"

// Login e Home carregam de imediato (são as primeiras telas que a pessoa vê).
// O resto só baixa quando a pessoa realmente navega até lá, então a
// abertura do app fica mais rápida.
import Login from "./pages/Login"
import Home from "./pages/Home"
const Pets = lazy(() => import("./pages/Pets"))
const PetForm = lazy(() => import("./pages/PetForm"))
const PetDetail = lazy(() => import("./pages/PetDetail"))
const EmergencyCard = lazy(() => import("./pages/EmergencyCard"))
const SOS = lazy(() => import("./pages/SOS"))
const SOSDetail = lazy(() => import("./pages/SOSDetail"))
const GuiaDetail = lazy(() => import("./pages/GuiaDetail"))
const Library = lazy(() => import("./pages/Library"))
const Account = lazy(() => import("./pages/Account"))
const Privacy = lazy(() => import("./pages/Privacy"))

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
    <Suspense fallback={<FullscreenLoader />}>
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
    </Suspense>
  )
}
