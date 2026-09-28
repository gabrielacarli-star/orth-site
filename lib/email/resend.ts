import "server-only"

export function emailConfigurado() {
  return Boolean(process.env.RESEND_API_KEY)
}

export async function enviarEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error("RESEND_API_KEY não configurada.")

  const remetente = process.env.EMAIL_REMETENTE || "ORTH Sistema <onboarding@resend.dev>"

  const resposta = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: remetente, to: [to], subject, html }),
  })

  if (!resposta.ok) {
    throw new Error(`Falha ao enviar e-mail: ${await resposta.text()}`)
  }
  return resposta.json()
}
