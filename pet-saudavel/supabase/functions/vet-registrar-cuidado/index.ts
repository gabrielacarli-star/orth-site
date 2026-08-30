// =========================================================================
// Edge Function: vet-registrar-cuidado
// Usada pela Área do Veterinário. Registra uma vacina ou um
// antiparasitário (vermífugo/pulga/carrapato) direto num pet, sem passar
// pelo celular do tutor. Só funciona pra quem está em `veterinarios` com
// ativo = true.
// =========================================================================
import { createClient } from "jsr:@supabase/supabase-js@2"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}
const json = (o: unknown, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { ...cors, "content-type": "application/json" } })

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })
  try {
    const authHeader = req.headers.get("Authorization") ?? ""
    if (!authHeader) return json({ error: "sem_autenticacao" }, 401)

    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: authHeader } } })
    const {
      data: { user },
    } = await userClient.auth.getUser()
    if (!user) return json({ error: "sem_autenticacao" }, 401)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })

    const { data: vet } = await admin
      .from("veterinarios")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("ativo", true)
      .maybeSingle()
    if (!vet) return json({ error: "sem_acesso" }, 403)

    const body = await req.json().catch(() => ({}))
    const { pet_id, categoria } = body

    if (!pet_id || !categoria) return json({ error: "dados_incompletos" }, 400)

    // Confirma que o pet existe (evita gravar cuidado em pet_id inventado).
    const { data: pet } = await admin.from("pets").select("id").eq("id", pet_id).maybeSingle()
    if (!pet) return json({ error: "pet_nao_encontrado" }, 404)

    if (categoria === "vacina") {
      const { nome, data_aplicacao, proxima_dose, observacao } = body
      if (!nome || !data_aplicacao) return json({ error: "dados_incompletos" }, 400)
      const { data: inserido, error } = await admin
        .from("vacinas")
        .insert({
          pet_id,
          nome,
          data_aplicacao,
          proxima_dose: proxima_dose || null,
          observacao: observacao || null,
        })
        .select()
        .single()
      if (error) throw error
      return json({ ok: true, inserido })
    }

    if (categoria === "antiparasitario") {
      const { tipo, produto, data_aplicacao, intervalo_dias, proxima_dose } = body
      if (!data_aplicacao) return json({ error: "dados_incompletos" }, 400)
      const { data: inserido, error } = await admin
        .from("antiparasitarios")
        .insert({
          pet_id,
          tipo: tipo || "vermifugo",
          produto: produto || null,
          data_aplicacao,
          intervalo_dias: intervalo_dias || 90,
          proxima_dose: proxima_dose || null,
        })
        .select()
        .single()
      if (error) throw error
      return json({ ok: true, inserido })
    }

    return json({ error: "categoria_invalida" }, 400)
  } catch (e) {
    return json({ error: "falha", detalhe: String(e) }, 500)
  }
})
