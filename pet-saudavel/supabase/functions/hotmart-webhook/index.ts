// =========================================================================
// Edge Function: hotmart-webhook
// Recebe as notificações da Hotmart e mantém a tabela `compras` em dia.
// - Compra aprovada  → grava/ativa o acesso (liga ao usuário se o e-mail já existir).
// - Reembolso/chargeback/cancelamento → marca a compra como "reembolsado".
//
// Segurança: a Hotmart envia um token (hottok). Configuramos o mesmo valor
// no segredo HOTMART_HOTTOK e recusamos qualquer requisição que não bata.
//
// Esta função NÃO exige JWT do usuário → configure verify_jwt = false
// (ver supabase/config.toml). Ela usa a SERVICE_ROLE e ignora o RLS.
// =========================================================================
import { createClient } from "jsr:@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const HOTTOK = Deno.env.get("HOTMART_HOTTOK") ?? ""

const APROVADAS = new Set([
  "PURCHASE_APPROVED",
  "PURCHASE_COMPLETE",
  "PURCHASE_COMPLETED",
])
const CANCELADAS = new Set([
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "PURCHASE_PROTEST",
])

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 })

  // Valida o token da Hotmart (header ou querystring).
  const url = new URL(req.url)
  const token = req.headers.get("x-hotmart-hottok") ?? url.searchParams.get("hottok") ?? ""
  if (!HOTTOK || token !== HOTTOK) {
    return new Response("Unauthorized", { status: 401 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response("Bad request", { status: 400 })
  }

  const evento: string = body?.event ?? body?.data?.event ?? ""
  const data = body?.data ?? body
  const email: string | undefined = data?.buyer?.email ?? data?.purchase?.buyer?.email
  const productId =
    data?.product?.id ?? data?.product?.ucode ?? data?.purchase?.product?.id
  const produtoIdStr = productId != null ? String(productId) : ""

  if (!email || !produtoIdStr) {
    // Evento sem os dados que nos interessam — respondemos 200 para a
    // Hotmart não ficar reenviando.
    return json({ ok: true, ignored: true })
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  })
  const emailLc = String(email).toLowerCase()

  if (CANCELADAS.has(evento)) {
    await supabase
      .from("compras")
      .update({ status: "reembolsado" })
      .eq("hotmart_product_id", produtoIdStr)
      .eq("email_compra", emailLc)
    return json({ ok: true, status: "reembolsado" })
  }

  if (APROVADAS.has(evento)) {
    // Já existe conta com esse e-mail? Liga a compra a ela.
    const { data: userRow } = await supabase
      .schema("auth")
      .from("users")
      .select("id")
      .ilike("email", emailLc)
      .maybeSingle()

    // Evita duplicar se o mesmo evento chegar duas vezes.
    const { data: existente } = await supabase
      .from("compras")
      .select("id")
      .eq("hotmart_product_id", produtoIdStr)
      .eq("email_compra", emailLc)
      .maybeSingle()

    if (existente) {
      await supabase
        .from("compras")
        .update({ status: "ativo", user_id: userRow?.id ?? null })
        .eq("id", existente.id)
    } else {
      await supabase.from("compras").insert({
        email_compra: emailLc,
        hotmart_product_id: produtoIdStr,
        status: "ativo",
        user_id: userRow?.id ?? null,
      })
    }
    return json({ ok: true, status: "ativo", vinculado: Boolean(userRow?.id) })
  }

  return json({ ok: true, ignored: true, evento })
})

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  })
}
