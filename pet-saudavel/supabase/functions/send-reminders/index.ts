// =========================================================================
// Edge Function: send-reminders  (rotina diária)
// Varre as próximas doses e envia e-mail para o tutor:
//   • 7 dias antes do vencimento
//   • no dia do vencimento
// Assinado "Dr. Eduardo Sebastião". Enviado pelo Resend.
//
// Agende com pg_cron (ver README) para rodar 1x por dia, ex.: 09:00.
// Proteja com o segredo CRON_SECRET (header x-cron-secret) para ninguém
// disparar de fora.
// =========================================================================
import { createClient } from "jsr:@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? ""
const FROM = Deno.env.get("REMINDER_FROM") ?? "Dr. Eduardo Sebastião <no-reply@medveteduardosebastiao.com>"
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? ""

function isoMaisDias(dias: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

interface Aviso {
  userId: string
  petNome: string
  titulo: string
  data: string
  quando: "hoje" | "7dias"
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } })
  const hoje = isoMaisDias(0)
  const em7 = isoMaisDias(7)

  // Busca pets (para nome + dono) e as doses que vencem hoje ou em 7 dias.
  const [{ data: pets }, { data: vacinas }, { data: antip }] = await Promise.all([
    admin.from("pets").select("id, nome, user_id"),
    admin.from("vacinas").select("pet_id, nome, proxima_dose").in("proxima_dose", [hoje, em7]),
    admin.from("antiparasitarios").select("pet_id, tipo, proxima_dose").in("proxima_dose", [hoje, em7]),
  ])

  const petMap = new Map((pets ?? []).map((p: any) => [p.id, p]))
  const avisos: Aviso[] = []

  for (const v of vacinas ?? []) {
    const pet = petMap.get((v as any).pet_id)
    if (!pet) continue
    avisos.push({
      userId: pet.user_id,
      petNome: pet.nome,
      titulo: `Vacina: ${(v as any).nome}`,
      data: (v as any).proxima_dose,
      quando: (v as any).proxima_dose === hoje ? "hoje" : "7dias",
    })
  }
  for (const a of antip ?? []) {
    const pet = petMap.get((a as any).pet_id)
    if (!pet) continue
    const nome =
      (a as any).tipo === "pulga" ? "Antipulgas" : (a as any).tipo === "carrapato" ? "Anticarrapato" : "Vermífugo"
    avisos.push({
      userId: pet.user_id,
      petNome: pet.nome,
      titulo: nome,
      data: (a as any).proxima_dose,
      quando: (a as any).proxima_dose === hoje ? "hoje" : "7dias",
    })
  }

  if (avisos.length === 0) return json({ ok: true, enviados: 0 })

  // Agrupa por usuário e resolve o e-mail de cada um.
  const porUsuario = new Map<string, Aviso[]>()
  for (const av of avisos) {
    const arr = porUsuario.get(av.userId) ?? []
    arr.push(av)
    porUsuario.set(av.userId, arr)
  }

  let enviados = 0
  for (const [userId, lista] of porUsuario) {
    const { data: userRes } = await admin.auth.admin.getUserById(userId)
    const email = userRes?.user?.email
    if (!email) continue
    const ok = await enviarEmail(email, lista)
    if (ok) enviados++
  }

  return json({ ok: true, usuarios: porUsuario.size, enviados })
})

async function enviarEmail(to: string, avisos: Aviso[]): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY ausente - pulando envio")
    return false
  }
  const linhas = avisos
    .map((a) => {
      const prazo = a.quando === "hoje" ? "vence hoje" : "vence em 7 dias"
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #E3D7BE;color:#3A2A1A">
          <strong>${a.titulo}</strong><br/>
          <span style="color:#6F5B3E;font-size:14px">${a.petNome} · ${prazo} (${formatarBR(a.data)})</span>
        </td>
      </tr>`
    })
    .join("")

  const html = `
  <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#F1E7D2;padding:28px 24px;border:1px solid #B2925A">
    <div style="text-align:center;margin-bottom:18px">
      <div style="display:inline-block;width:56px;height:56px;line-height:56px;border:2px solid #B2925A;border-radius:50%;color:#3A2A1A;font-weight:bold;font-size:20px">ES</div>
    </div>
    <h1 style="font-size:18px;color:#3A2A1A;text-align:center;margin:0 0 6px">Lembrete de cuidado</h1>
    <p style="color:#6F5B3E;text-align:center;margin:0 0 20px;font-size:14px">Está chegando a hora de um cuidado importante:</p>
    <table style="width:100%;border-collapse:collapse">${linhas}</table>
    <p style="color:#6F5B3E;font-size:14px;margin-top:20px">Abra o app Pet Saudável para ver os detalhes e marcar como feito.</p>
    <p style="color:#3A2A1A;font-size:14px;margin-top:24px">Um abraço,<br/><strong>Dr. Eduardo Sebastião</strong><br/><span style="color:#6F5B3E">CRMV-MT</span></p>
    <p style="color:#9a8;font-size:11px;margin-top:20px;text-align:center">Este e-mail organiza e lembra. Não substitui a consulta veterinária.</p>
  </div>`

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to,
      subject: "🐾 Lembrete de cuidado do seu pet",
      html,
    }),
  })
  if (!res.ok) console.error("Resend falhou:", await res.text())
  return res.ok
}

function formatarBR(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}
function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } })
}
