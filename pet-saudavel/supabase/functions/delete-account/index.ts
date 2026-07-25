// =========================================================================
// Edge Function: delete-account  (direito do titular - LGPD/RGPD)
// Apaga a conta do tutor logado e TODOS os seus dados.
// Os pets (e, em cascata, vacinas/antiparasitários/pesos) são removidos;
// as compras são desvinculadas; por fim o usuário de auth é excluído.
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

    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
    } = await userClient.auth.getUser()
    if (!user) return jsonResponse({ error: "sem_autenticacao" }, 401)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })

    // 1) Apaga os pets (cascata cuida de vacinas, antiparasitários e pesos).
    await admin.from("pets").delete().eq("user_id", user.id)
    // 2) Desvincula as compras (mantém o histórico financeiro sem dono).
    await admin.from("compras").update({ user_id: null }).eq("user_id", user.id)
    // 3) Remove o usuário de autenticação.
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) throw error

    return jsonResponse({ ok: true })
  } catch (e) {
    return jsonResponse({ error: "falha", detalhe: String(e) }, 500)
  }
})
