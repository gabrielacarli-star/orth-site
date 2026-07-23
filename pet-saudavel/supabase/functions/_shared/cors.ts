// Cabeçalhos CORS compartilhados pelas funções chamadas pelo navegador.
// Em produção, troque "*" pelo domínio do app (ex.: https://app.medveteduardosebastiao.com)
// para restringir quem pode chamar as funções.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

export function jsonResponse(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  })
}
