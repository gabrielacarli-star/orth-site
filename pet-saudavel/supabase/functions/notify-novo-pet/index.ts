// =========================================================================
// Edge Function: notify-novo-pet
// Dispara um e-mail para a Gabriela toda vez que um pet é cadastrado no
// app. Chamada pelo trigger on_pet_created_notificar (banco).
// =========================================================================
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? ""
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? ""
const FROM = Deno.env.get("REMINDER_FROM") ?? "Pet Saudável <no-reply@medveteduardosebastiao.com>"
const PARA = "gabrielacarli@gmail.com"

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { pet_nome, especie, dono_email } = await req.json().catch(() => ({}))

  if (RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: PARA,
        subject: "🐾 Novo pet cadastrado no Pet Saudável",
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:20px">
            <p>Um pet novo foi cadastrado no app.</p>
            <p><strong>Nome do pet:</strong> ${pet_nome || "(não informado)"}</p>
            <p><strong>Espécie:</strong> ${especie || "(não informado)"}</p>
            <p><strong>Tutor (e-mail):</strong> ${dono_email || "(não encontrado)"}</p>
          </div>`,
      }),
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
})
