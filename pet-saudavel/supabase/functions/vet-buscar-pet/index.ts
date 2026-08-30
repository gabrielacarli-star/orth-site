// =========================================================================
// Edge Function: vet-buscar-pet
// Usada pela Área do Veterinário. Busca pets por nome do pet e/ou e-mail
// do tutor. Só funciona pra quem está cadastrado na tabela `veterinarios`
// com ativo = true - conferido aqui, com service_role, nunca por RLS.
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

    const { nome_pet, email_tutor } = await req.json().catch(() => ({ nome_pet: "", email_tutor: "" }))
    const nomePet = String(nome_pet ?? "").trim()
    const emailTutor = String(email_tutor ?? "").trim().toLowerCase()

    if (!nomePet && !emailTutor) return json({ error: "informe_nome_ou_email" }, 400)

    let userIds: string[] | null = null
    if (emailTutor) {
      const { data: users } = await admin
        .schema("auth")
        .from("users")
        .select("id, email")
        .ilike("email", `%${emailTutor}%`)
      userIds = (users ?? []).map((u) => u.id)
      if (userIds.length === 0) return json({ pets: [] })
    }

    let query = admin.from("pets").select("id, nome, especie, raca, user_id").order("nome")
    if (nomePet) query = query.ilike("nome", `%${nomePet}%`)
    if (userIds) query = query.in("user_id", userIds)
    const { data: pets, error } = await query.limit(20)
    if (error) throw error

    const donoIds = [...new Set((pets ?? []).map((p) => p.user_id))]
    const donos = new Map<string, string>()
    for (const id of donoIds) {
      const { data: u } = await admin.schema("auth").from("users").select("email").eq("id", id).maybeSingle()
      if (u?.email) donos.set(id, u.email)
    }

    const resultado = (pets ?? []).map((p) => ({
      pet_id: p.id,
      pet_nome: p.nome,
      especie: p.especie,
      raca: p.raca,
      tutor_email: donos.get(p.user_id) ?? null,
    }))

    return json({ pets: resultado })
  } catch (e) {
    return json({ error: "falha", detalhe: String(e) }, 500)
  }
})
