// =========================================================================
// Edge Function: sos-conteudo
// Entrega o passo a passo completo de uma emergência SOS, mas SOMENTE se
// o tutor logado tiver uma compra ativa de um produto marcado com
// desbloqueia_sos = true. O texto sensível nunca fica no pacote do app.
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

    const { slug } = await req.json().catch(() => ({ slug: "" }))
    if (!slug) return jsonResponse({ error: "slug_ausente" }, 400)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })

    // O usuário precisa ter ao menos uma compra ativa de um produto que
    // libera o SOS.
    const { data: compras } = await admin
      .from("compras")
      .select("hotmart_product_id")
      .eq("user_id", user.id)
      .eq("status", "ativo")
    const idsComprados = (compras ?? []).map((c) => c.hotmart_product_id)
    if (idsComprados.length === 0) return jsonResponse({ error: "sem_acesso" }, 403)

    const { data: produtoLiberador } = await admin
      .from("produtos")
      .select("id")
      .in("hotmart_product_id", idsComprados)
      .eq("desbloqueia_sos", true)
      .eq("ativo", true)
      .limit(1)
      .maybeSingle()
    if (!produtoLiberador) return jsonResponse({ error: "sem_acesso" }, 403)

    const { data: conteudo, error } = await admin
      .from("sos_conteudo")
      .select("slug, sinais, passos, nunca_faca, levar_ao_vet")
      .eq("slug", slug)
      .maybeSingle()
    if (error) throw error
    if (!conteudo) return jsonResponse({ error: "nao_encontrado" }, 404)

    return jsonResponse(conteudo)
  } catch (e) {
    return jsonResponse({ error: "falha", detalhe: String(e) }, 500)
  }
})
