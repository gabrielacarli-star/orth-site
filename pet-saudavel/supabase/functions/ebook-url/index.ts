// =========================================================================
// Edge Function: ebook-url
// Gera um link temporário (assinado, expira em minutos) para o PDF de um
// e-book - SOMENTE se o tutor logado tiver uma compra ativa daquele produto.
// O app nunca recebe o caminho real nem um link permanente.
// =========================================================================
import { createClient } from "jsr:@supabase/supabase-js@2"
import { corsHeaders, jsonResponse } from "../_shared/cors.ts"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const BUCKET = "ebooks"
const EXPIRA_SEGUNDOS = 300 // 5 minutos

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

    const { produto_id } = await req.json().catch(() => ({ produto_id: "" }))
    if (!produto_id) return jsonResponse({ error: "produto_ausente" }, 400)

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    })

    // Busca o produto e seu arquivo.
    const { data: produto } = await admin
      .from("produtos")
      .select("id, hotmart_product_id, arquivo_path, ativo")
      .eq("id", produto_id)
      .maybeSingle()
    if (!produto || !produto.ativo || !produto.arquivo_path) {
      return jsonResponse({ error: "produto_indisponivel" }, 404)
    }

    // Confere se o usuário tem compra ativa desse produto.
    const { data: compra } = await admin
      .from("compras")
      .select("id")
      .eq("user_id", user.id)
      .eq("hotmart_product_id", produto.hotmart_product_id)
      .eq("status", "ativo")
      .maybeSingle()
    if (!compra) return jsonResponse({ error: "sem_acesso" }, 403)

    // Gera o link assinado de curta duração.
    const { data: signed, error } = await admin.storage
      .from(BUCKET)
      .createSignedUrl(produto.arquivo_path, EXPIRA_SEGUNDOS)
    if (error || !signed) throw error ?? new Error("sem_url")

    return jsonResponse({ url: signed.signedUrl })
  } catch (e) {
    return jsonResponse({ error: "falha", detalhe: String(e) }, 500)
  }
})
