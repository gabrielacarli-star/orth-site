import { createAdminClient } from "@/lib/supabase/admin"
import { emailConfigurado, enviarEmail } from "@/lib/email/resend"

function hojeBrasil() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
}

function montarHtml(nome: string, itens: { hora: string; titulo: string; cliente: string | null; notas: string | null }[]) {
  const linhas = itens
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:600;white-space:nowrap;">${i.hora}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;">
            ${i.titulo}${i.cliente ? ` — ${i.cliente}` : ""}
            ${i.notas ? `<br><span style="color:#666;font-size:13px;">${i.notas}</span>` : ""}
          </td>
        </tr>`
    )
    .join("")

  return `
    <div style="font-family:Arial,sans-serif;color:#111;max-width:520px;">
      <p>Bom dia, ${nome}!</p>
      <p>Esses são os seus compromissos de hoje no sistema da ORTH:</p>
      <table style="border-collapse:collapse;width:100%;">${linhas}</table>
      <p style="margin-top:20px;color:#888;font-size:12px;">
        Esse e-mail é enviado automaticamente todo dia pelo sistema da ORTH. Pra ver ou editar sua agenda, entre em orth-site-phi.vercel.app/sistema.
      </p>
    </div>`
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response("Não autorizado", { status: 401 })
    }
  }

  if (!emailConfigurado()) {
    return Response.json({ ok: false, motivo: "RESEND_API_KEY não configurada" })
  }

  const admin = createAdminClient()
  const hoje = hojeBrasil()
  const inicioUTC = new Date(`${hoje}T00:00:00-03:00`).toISOString()
  const fimUTC = new Date(`${hoje}T23:59:59-03:00`).toISOString()

  const [{ data: vendedores }, { data: usersData }, { data: agendamentos }] = await Promise.all([
    admin.from("vendedores").select("id, perfis(nome)").eq("ativo", true),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin
      .from("agendamentos")
      .select("vendedor_id, titulo, cliente_nome, data_hora, notas")
      .eq("status", "agendado")
      .gte("data_hora", inicioUTC)
      .lte("data_hora", fimUTC)
      .order("data_hora", { ascending: true }),
  ])

  const emailPorId = new Map(usersData?.users.map((u) => [u.id, u.email]))
  const agendaPorVendedor = new Map<string, typeof agendamentos>()
  for (const a of agendamentos ?? []) {
    const lista = agendaPorVendedor.get(a.vendedor_id) ?? []
    lista.push(a)
    agendaPorVendedor.set(a.vendedor_id, lista)
  }

  const resultados: { vendedorId: string; status: string }[] = []

  for (const v of vendedores ?? []) {
    const itens = agendaPorVendedor.get(v.id)
    if (!itens || itens.length === 0) continue

    const email = emailPorId.get(v.id)
    if (!email) {
      resultados.push({ vendedorId: v.id, status: "sem e-mail cadastrado" })
      continue
    }

    const { data: jaEnviado } = await admin
      .from("resumos_diarios_enviados")
      .select("vendedor_id")
      .eq("vendedor_id", v.id)
      .eq("data", hoje)
      .maybeSingle()
    if (jaEnviado) {
      resultados.push({ vendedorId: v.id, status: "já enviado hoje" })
      continue
    }

    const nome = (v.perfis as unknown as { nome: string } | null)?.nome ?? "vendedor(a)"
    const html = montarHtml(
      nome,
      itens.map((a) => ({
        hora: new Date(a.data_hora).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Sao_Paulo",
        }),
        titulo: a.titulo,
        cliente: a.cliente_nome,
        notas: a.notas,
      }))
    )

    try {
      await enviarEmail({
        to: email,
        subject: `Sua agenda de hoje na ORTH (${itens.length} compromisso${itens.length > 1 ? "s" : ""})`,
        html,
      })
      await admin.from("resumos_diarios_enviados").insert({ vendedor_id: v.id, data: hoje })
      resultados.push({ vendedorId: v.id, status: "enviado" })
    } catch (err) {
      resultados.push({
        vendedorId: v.id,
        status: `erro: ${err instanceof Error ? err.message : "desconhecido"}`,
      })
    }
  }

  return Response.json({ ok: true, data: hoje, resultados })
}
