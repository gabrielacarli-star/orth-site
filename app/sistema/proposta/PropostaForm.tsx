"use client"

import { useState } from "react"
import type { ItemInvestimento } from "@/lib/pdf/PropostaDocument"

const inputClass =
  "w-full rounded-lg bg-orth-dark border border-orth-line/20 px-3.5 py-2 text-white placeholder:text-orth-muted/60 focus:outline-none focus:ring-2 focus:ring-orth-electric text-sm"
const textareaClass = `${inputClass} min-h-[110px] leading-relaxed`

const MODELOS_TRABALHO: Record<string, { comoVamosTrabalhar: string; prazo: string }> = {
  "Tráfego (Google Ads + Meta Ads)": {
    comoVamosTrabalhar:
      "Assim que o contrato for assinado, enviamos o Diagnóstico Inicial, um levantamento estratégico que nos permite entender a fundo o negócio, o momento atual e os objetivos com as campanhas.\n\nCom base nesse diagnóstico, somado à auditoria das contas de anúncios e à análise do site, desenvolvemos a estratégia sob medida para os dois canais.\n\nNo Google Ads, estruturamos campanhas de pesquisa focadas em buscas com intenção de compra, com palavras-chave selecionadas e segmentação geográfica.\n\nNo Meta Ads, estruturamos as campanhas pelo Meta Business, com públicos segmentados por região, perfil e interesse.\n\nO acompanhamento é minucioso e ativo: enviamos relatório de performance toda semana, com os principais indicadores e os próximos ajustes planejados.",
    prazo:
      "Após a assinatura do contrato, o Diagnóstico Inicial é enviado em até 2 dias úteis. A auditoria das contas e a estruturação da estratégia levam até 5 dias úteis para as campanhas estarem ativas.",
  },
  "Criação de Site": {
    comoVamosTrabalhar:
      "Assim que o contrato for assinado, enviamos um briefing pra entender o negócio, o objetivo do site e as referências visuais que fazem sentido pra marca.\n\nCom base nisso, desenvolvemos a estrutura, o conteúdo e o design do site, com pontos de revisão junto ao cliente antes da publicação.\n\nApós a aprovação final, o site é publicado, testado em diferentes dispositivos e entregue já otimizado para conversão.",
    prazo: "O prazo de entrega é combinado após o briefing, de acordo com a complexidade do projeto.",
  },
}

export function PropostaForm({
  vendedoresPrecos,
}: {
  vendedoresPrecos: { servico: string; tipoSugerido: "setup" | "mensal" }[]
}) {
  const [clienteNome, setClienteNome] = useState("")
  const [clienteSegmento, setClienteSegmento] = useState("")
  const [tituloProposta, setTituloProposta] = useState("")
  const [subtituloProposta, setSubtituloProposta] = useState("")
  const [oQueIdentificamos, setOQueIdentificamos] = useState("")
  const [comoVamosTrabalhar, setComoVamosTrabalhar] = useState("")
  const [prazo, setPrazo] = useState("")
  const [observacaoInvestimento, setObservacaoInvestimento] = useState(
    "O valor investido em anúncios (verba de mídia) é pago diretamente às plataformas Google e Meta e não está incluso nos valores de gestão."
  )
  const [validadeDias, setValidadeDias] = useState(5)
  const [itens, setItens] = useState<ItemInvestimento[]>([
    { nome: "", descricao: "", tipo: "setup", valor: 0 },
  ])
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState("")

  function aplicarModelo(nome: string) {
    const modelo = MODELOS_TRABALHO[nome]
    if (!modelo) return
    setComoVamosTrabalhar(modelo.comoVamosTrabalhar)
    setPrazo(modelo.prazo)
  }

  function atualizarItem(index: number, campo: keyof ItemInvestimento, valor: string | number) {
    setItens((atual) =>
      atual.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    )
  }

  function adicionarItem(nomeSugerido?: string, tipoSugerido?: "setup" | "mensal") {
    setItens((atual) => [
      ...atual,
      { nome: nomeSugerido ?? "", descricao: "", tipo: tipoSugerido ?? "setup", valor: 0 },
    ])
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index))
  }

  async function gerarPdf() {
    setErro("")
    if (!clienteNome.trim() || !tituloProposta.trim()) {
      setErro("Preencha ao menos o nome do cliente e o título da proposta.")
      return
    }
    const itensValidos = itens.filter((i) => i.nome.trim() && i.valor > 0)
    if (itensValidos.length === 0) {
      setErro("Adicione ao menos um item de investimento com nome e valor.")
      return
    }

    setGerando(true)
    try {
      const resposta = await fetch("/api/sistema/proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNome,
          clienteSegmento,
          tituloProposta,
          subtituloProposta,
          oQueIdentificamos,
          comoVamosTrabalhar,
          prazo,
          itens: itensValidos,
          observacaoInvestimento,
          validadeDias,
        }),
      })

      if (!resposta.ok) {
        setErro(await resposta.text())
        return
      }

      const blob = await resposta.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `proposta-${clienteNome}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setErro("Não foi possível gerar o PDF. Tente novamente.")
    } finally {
      setGerando(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5">
        <h3 className="sm:col-span-2 text-white font-medium">Dados do cliente e da proposta</h3>
        <input
          placeholder="Nome do cliente / empresa"
          value={clienteNome}
          onChange={(e) => setClienteNome(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Segmento e cidade (ex: Ótica · Cuiabá, MT)"
          value={clienteSegmento}
          onChange={(e) => setClienteSegmento(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Título da proposta (ex: Gestão de Tráfego)"
          value={tituloProposta}
          onChange={(e) => setTituloProposta(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Subtítulo (ex: Estratégia e performance em Google Ads e Meta Ads)"
          value={subtituloProposta}
          onChange={(e) => setSubtituloProposta(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-3">
        <h3 className="text-white font-medium">1. O que identificamos</h3>
        <p className="text-orth-muted text-xs">
          Escreva o diagnóstico específico desse cliente: o que ele já tem, a oportunidade e por
          que a estratégia proposta faz sentido pra ele. Pule uma linha em branco entre parágrafos.
        </p>
        <textarea
          value={oQueIdentificamos}
          onChange={(e) => setOQueIdentificamos(e.target.value)}
          className={textareaClass}
          placeholder="Ex: A [empresa] já conta com site otimizado e perfil ativo no Google Meu Negócio..."
        />
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-white font-medium">2. Como vamos trabalhar &amp; 3. Prazo</h3>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(MODELOS_TRABALHO).map((nome) => (
              <button
                key={nome}
                type="button"
                onClick={() => aplicarModelo(nome)}
                className="text-xs rounded-full border border-orth-line/20 px-3 py-1 text-orth-muted hover:text-white hover:border-orth-electric transition-colors"
              >
                Usar modelo: {nome}
              </button>
            ))}
          </div>
        </div>
        <textarea
          value={comoVamosTrabalhar}
          onChange={(e) => setComoVamosTrabalhar(e.target.value)}
          className={textareaClass}
          placeholder="Como o trabalho vai ser conduzido, etapa por etapa..."
        />
        <textarea
          value={prazo}
          onChange={(e) => setPrazo(e.target.value)}
          className={inputClass}
          placeholder="Prazo (ex: Após a assinatura, o diagnóstico é enviado em até 2 dias úteis...)"
        />
      </div>

      <div className="rounded-xl border border-orth-line/10 bg-orth-navy/40 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-white font-medium">4. Investimento</h3>
          {vendedoresPrecos.length > 0 && (
            <select
              defaultValue=""
              onChange={(e) => {
                const escolhido = vendedoresPrecos.find((v) => v.servico === e.target.value)
                if (escolhido) adicionarItem(escolhido.servico, escolhido.tipoSugerido)
                e.target.value = ""
              }}
              className="text-xs rounded-lg bg-orth-dark border border-orth-line/20 px-2.5 py-1.5 text-white"
            >
              <option value="" disabled>
                + adicionar item da tabela de preços
              </option>
              {vendedoresPrecos.map((v) => (
                <option key={v.servico} value={v.servico}>
                  {v.servico}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="space-y-3">
          {itens.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2 items-start bg-orth-dark/40 rounded-lg p-3"
            >
              <input
                placeholder="Nome do item (ex: Setup de Meta Ads)"
                value={item.nome}
                onChange={(e) => atualizarItem(i, "nome", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Descrição curta (opcional)"
                value={item.descricao}
                onChange={(e) => atualizarItem(i, "descricao", e.target.value)}
                className={inputClass}
              />
              <select
                value={item.tipo}
                onChange={(e) => atualizarItem(i, "tipo", e.target.value)}
                className={`${inputClass} sm:w-32`}
              >
                <option value="setup">Setup (único)</option>
                <option value="mensal">Mensal</option>
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Valor (R$)"
                value={item.valor || ""}
                onChange={(e) => atualizarItem(i, "valor", Number(e.target.value))}
                className={`${inputClass} sm:w-32`}
              />
              <button
                type="button"
                onClick={() => removerItem(i)}
                className="text-xs text-orth-muted hover:text-red-400 transition-colors sm:py-2"
              >
                remover
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => adicionarItem()}
          className="text-sm text-orth-sky hover:text-white transition-colors"
        >
          + adicionar item manualmente
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-orth-line/10">
          <div>
            <label className="block text-sm text-orth-muted mb-1.5">
              Observação sobre verba de anúncios
            </label>
            <textarea
              value={observacaoInvestimento}
              onChange={(e) => setObservacaoInvestimento(e.target.value)}
              className={`${inputClass} min-h-[70px]`}
            />
            <p className="text-orth-muted text-xs mt-1">
              Apague o texto se a proposta não tiver Google Ads / Meta Ads.
            </p>
          </div>
          <div>
            <label className="block text-sm text-orth-muted mb-1.5">Proposta válida por (dias)</label>
            <input
              type="number"
              min="1"
              value={validadeDias}
              onChange={(e) => setValidadeDias(Number(e.target.value))}
              className={`${inputClass} w-28`}
            />
          </div>
        </div>
      </div>

      {erro && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {erro}
        </p>
      )}

      <button
        type="button"
        onClick={gerarPdf}
        disabled={gerando}
        className="w-full sm:w-auto rounded-lg bg-orth-electric hover:bg-orth-blue transition-colors text-white font-medium px-6 py-3 disabled:opacity-60"
      >
        {gerando ? "Gerando PDF..." : "Gerar proposta em PDF"}
      </button>
    </div>
  )
}
