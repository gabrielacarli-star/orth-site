// =========================================================================
// Edge Function: claim-purchase  ("Já comprei e não apareceu")
// O tutor logado informa o e-mail que usou no checkout da Hotmart.
// Vinculamos à conta dele todas as compras órfãs (user_id null) daquele e-mail.
// Retorna quantas compras foram liberadas.
// =========================================================================
import { createClient } from "jsr:@supabase/supabase-js@2"
import { corsHeaders, jsonResponse } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const authHeader = req.headers.get("Authorization") ?? ""
    if (!authHeader) return jsonResponse({ error: "sem_autenticacao" }, 401)

    // Identifica o usuário a partir do JWT enviado pelo app.
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
    } = await userClient.auth.getUser()
    if (!user) return jsonResponse({ error: "sem_autenticacao" }, 401)

    const { email } = await req.json().catch(() => ({ email: "" }))
    const emailLc = String(email ?? "").trim().toLowerCase()
    if (!emailLc || !emailLc.includes("@")) {
      return jsonResponse({ error: "email_invalido" }, 400)
    }

    // service_role ignora RLS para poder ligar compras órfãs.
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })
    const { data, error } = await admin
      .from("compras")
      .update({ user_id: user.id })
      .is("user_id", null)
      .eq("email_compra", emailLc)
      .select("id")
    if (error) throw error

    return jsonResponse({ vinculadas: data?.length ?? 0 })
  } catch (e) {
    return jsonResponse({ error: "falha", detalhe: String(e) }, 500)
  }
})
