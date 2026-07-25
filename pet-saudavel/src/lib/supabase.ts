import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Erro claro em vez de uma tela branca silenciosa quando o .env não foi preenchido.
  throw new Error(
    "Faltam as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY. " +
      "Copie .env.example para .env e preencha com os dados do seu projeto Supabase.",
  )
}

// Cliente sem geração de tipos do schema; os resultados são convertidos
// explicitamente para as interfaces de domínio em lib/types.ts nas telas.
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
