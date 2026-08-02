// =========================================================================
// Edge Function: notify-cadastro
// Dispara um e-mail para a Gabriela toda vez que alguém cria conta no
// app. Chamada pelo trigger on_auth_user_created_notificar (banco).
// =========================================================================
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? ""
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? ""
const FROM = Deno.env.get("REMINDER_FROM") ?? "Pet Saudável <no-reply@medveteduardosebastiao.com>"
const PARA = "gabrielacarli@gmail.com"

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { email, criado_em } = await req.json().catch(() => ({ email: "", criado_em: "" }))

  if (RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: PARA,
        subject: "🐾 Novo cadastro no Pet Saudável",
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:20px">
            <p>Alguém acabou de criar conta no app.</p>
            <p><strong>E-mail:</strong> ${email || "(não informado)"}</p>
            <p><strong>Quando:</strong> ${criado_em || "(agora)"}</p>
          </div>`,
      }),
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
})
