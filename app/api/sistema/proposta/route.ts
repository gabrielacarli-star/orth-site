import { renderToBuffer } from "@react-pdf/renderer"
import { getPerfil } from "@/lib/dal"
import { PropostaDocument, type PropostaData } from "@/lib/pdf/PropostaDocument"

function slug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase()
}

export async function POST(request: Request) {
  const perfil = await getPerfil()
  if (!perfil) {
    return new Response("Não autorizado", { status: 401 })
  }

  let body: Partial<PropostaData>
  try {
    body = await request.json()
  } catch {
    return new Response("JSON inválido", { status: 400 })
  }

  const clienteNome = String(body.clienteNome || "").trim()
  const tituloProposta = String(body.tituloProposta || "").trim()
  const itens = Array.isArray(body.itens) ? body.itens : []

  if (!clienteNome || !tituloProposta) {
    return new Response("Preencha ao menos o nome do cliente e o título da proposta.", {
      status: 400,
    })
  }

  const dados: PropostaData = {
    tituloProposta,
    subtituloProposta: String(body.subtituloProposta || ""),
    clienteNome,
    clienteSegmento: String(body.clienteSegmento || ""),
    cidadeData:
      String(body.cidadeData || "") ||
      `São Paulo, ${new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
    oQueIdentificamos: String(body.oQueIdentificamos || ""),
    comoVamosTrabalhar: String(body.comoVamosTrabalhar || ""),
    prazo: String(body.prazo || ""),
    itens: itens
      .map((i) => ({
        nome: String(i?.nome || "").trim(),
        descricao: String(i?.descricao || "").trim(),
        tipo: i?.tipo === "mensal" ? ("mensal" as const) : ("setup" as const),
        valor: Number(i?.valor) || 0,
      }))
      .filter((i) => i.nome && i.valor > 0),
    observacaoInvestimento: String(
      body.observacaoInvestimento ??
        "O valor investido em anúncios (verba de mídia) é pago diretamente às plataformas Google e Meta e não está incluso nos valores de gestão."
    ),
    validadeDias: Number(body.validadeDias) || 5,
  }

  const buffer = await renderToBuffer(PropostaDocument(dados))
  const nomeArquivo = `proposta-${slug(dados.tituloProposta)}-${slug(dados.clienteNome)}.pdf`

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
    },
  })
}
