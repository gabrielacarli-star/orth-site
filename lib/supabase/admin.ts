import "server-only"
import { createClient } from "@supabase/supabase-js"

/**
 * Cliente com a service_role key — ignora RLS. Só pode ser usado em código
 * de servidor (Server Actions / Route Handlers), nunca exposto ao navegador.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada. Adicione essa variável de ambiente."
    )
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
