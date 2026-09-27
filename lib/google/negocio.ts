import "server-only"

const SCOPE = "https://www.googleapis.com/auth/business.manage"
const TOKEN_URL = "https://oauth2.googleapis.com/token"
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const CONTAS_URL = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
const LOCALPOSTS_BASE = "https://mybusiness.googleapis.com/v4"

function credenciais() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI
  if (!clientId || !clientSecret || !redirectUri) return null
  return { clientId, clientSecret, redirectUri }
}

export function integracaoGoogleConfigurada() {
  return credenciais() !== null
}

export function gerarUrlDeConsentimento(clienteId: string) {
  const cred = credenciais()
  if (!cred) throw new Error("Integração com Google não configurada.")

  const params = new URLSearchParams({
    client_id: cred.clientId,
    redirect_uri: cred.redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state: clienteId,
  })
  return `${AUTH_URL}?${params.toString()}`
}

interface TokensGoogle {
  access_token: string
  refresh_token?: string
  id_token?: string
  expires_in: number
}

export async function trocarCodigoPorTokens(code: string): Promise<TokensGoogle> {
  const cred = credenciais()
  if (!cred) throw new Error("Integração com Google não configurada.")

  const resposta = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: cred.clientId,
      client_secret: cred.clientSecret,
      redirect_uri: cred.redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!resposta.ok) {
    throw new Error(`Falha ao trocar código por token: ${await resposta.text()}`)
  }
  return resposta.json()
}

export async function renovarAccessToken(refreshToken: string): Promise<TokensGoogle> {
  const cred = credenciais()
  if (!cred) throw new Error("Integração com Google não configurada.")

  const resposta = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: cred.clientId,
      client_secret: cred.clientSecret,
      grant_type: "refresh_token",
    }),
  })

  if (!resposta.ok) {
    throw new Error(`Falha ao renovar access token: ${await resposta.text()}`)
  }
  return resposta.json()
}

export function emailDoIdToken(idToken: string): string | null {
  try {
    const payloadBase64 = idToken.split(".")[1]
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString("utf-8"))
    return typeof payload.email === "string" ? payload.email : null
  } catch {
    return null
  }
}

export interface LocationGoogle {
  name: string
  displayName: string
}

export async function primeiraLocationDaConta(accessToken: string): Promise<LocationGoogle | null> {
  const headers = { Authorization: `Bearer ${accessToken}` }

  const respContas = await fetch(CONTAS_URL, { headers })
  if (!respContas.ok) throw new Error(`Falha ao listar contas do Google: ${await respContas.text()}`)
  const { accounts } = await respContas.json()
  if (!Array.isArray(accounts) || accounts.length === 0) return null

  for (const conta of accounts) {
    const url = `https://mybusinessbusinessinformation.googleapis.com/v1/${conta.name}/locations?readMask=name,title`
    const respLocations = await fetch(url, { headers })
    if (!respLocations.ok) continue
    const { locations } = await respLocations.json()
    if (Array.isArray(locations) && locations.length > 0) {
      return { name: locations[0].name, displayName: locations[0].title ?? "Perfil sem nome" }
    }
  }
  return null
}

export async function publicarLocalPost(accessToken: string, locationName: string, conteudo: string) {
  const resposta = await fetch(`${LOCALPOSTS_BASE}/${locationName}/localPosts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      languageCode: "pt-BR",
      summary: conteudo,
      topicType: "STANDARD",
    }),
  })

  if (!resposta.ok) {
    throw new Error(`Falha ao publicar post: ${await resposta.text()}`)
  }
  return resposta.json()
}
