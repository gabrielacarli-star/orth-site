import ExcelJS from "exceljs"
import { getPerfil } from "@/lib/dal"
import { createClient } from "@/lib/supabase/server"

interface LinhaRelatorio {
  data_venda: string
  vendedor_nome: string
  cliente_nome: string
  servico: string
  valor_venda: number
  comissao_percentual: number
  comissao_valor: number
  status_comissao: string
}

export async function GET(request: Request) {
  const perfil = await getPerfil()
  if (!perfil) {
    return new Response("Não autorizado", { status: 401 })
  }

  const supabase = await createClient()
  const url = new URL(request.url)
  const vendedorIdFiltro = url.searchParams.get("vendedor_id")

  let linhas: LinhaRelatorio[] = []
  let nomeArquivo = "relatorio-vendas"

  if (perfil.role === "admin") {
    let query = supabase
      .from("vendas")
      .select(
        "data_venda, cliente_nome, servico, valor_venda, comissao_percentual, comissao_valor, status_comissao, perfis(nome)"
      )
      .order("data_venda", { ascending: false })

    if (vendedorIdFiltro) query = query.eq("vendedor_id", vendedorIdFiltro)

    const { data } = await query
    linhas = (data ?? []).map((v) => ({
      data_venda: v.data_venda,
      vendedor_nome: (v.perfis as unknown as { nome: string } | null)?.nome ?? "—",
      cliente_nome: v.cliente_nome,
      servico: v.servico,
      valor_venda: Number(v.valor_venda),
      comissao_percentual: Number(v.comissao_percentual),
      comissao_valor: Number(v.comissao_valor),
      status_comissao: v.status_comissao === "paga" ? "Paga" : "Pendente",
    }))
    nomeArquivo = "relatorio-vendas-orth"
  } else {
    const { data } = await supabase
      .from("vendas")
      .select(
        "data_venda, cliente_nome, servico, valor_venda, comissao_percentual, comissao_valor, status_comissao"
      )
      .eq("vendedor_id", perfil.id)
      .order("data_venda", { ascending: false })

    linhas = (data ?? []).map((v) => ({
      data_venda: v.data_venda,
      vendedor_nome: perfil.nome,
      cliente_nome: v.cliente_nome,
      servico: v.servico,
      valor_venda: Number(v.valor_venda),
      comissao_percentual: Number(v.comissao_percentual),
      comissao_valor: Number(v.comissao_valor),
      status_comissao: v.status_comissao === "paga" ? "Paga" : "Pendente",
    }))
    nomeArquivo = `minhas-vendas-${perfil.nome.split(" ")[0].toLowerCase()}`
  }

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "ORTH Digital"
  workbook.created = new Date()

  const sheet = workbook.addWorksheet("Vendas")
  const colunas = [
    { header: "Data", key: "data_venda", width: 12 },
    ...(perfil.role === "admin" ? [{ header: "Vendedor", key: "vendedor_nome", width: 24 }] : []),
    { header: "Cliente", key: "cliente_nome", width: 24 },
    { header: "Serviço", key: "servico", width: 24 },
    { header: "Valor da Venda", key: "valor_venda", width: 16 },
    { header: "% Comissão", key: "comissao_percentual", width: 12 },
    { header: "Valor da Comissão", key: "comissao_valor", width: 18 },
    { header: "Status", key: "status_comissao", width: 12 },
  ]
  sheet.columns = colunas

  sheet.getRow(1).font = { bold: true }
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0A1C4E" },
  }
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }

  for (const linha of linhas) {
    sheet.addRow({
      ...linha,
      data_venda: new Date(linha.data_venda + "T00:00:00").toLocaleDateString("pt-BR"),
    })
  }

  sheet.getColumn("valor_venda").numFmt = '"R$" #,##0.00'
  sheet.getColumn("comissao_valor").numFmt = '"R$" #,##0.00'
  sheet.getColumn("comissao_percentual").numFmt = '0.00"%"'

  const totalVenda = linhas.reduce((acc, l) => acc + l.valor_venda, 0)
  const totalComissao = linhas.reduce((acc, l) => acc + l.comissao_valor, 0)
  const linhaTotal = sheet.addRow({
    cliente_nome: "TOTAL",
    valor_venda: totalVenda,
    comissao_valor: totalComissao,
  })
  linhaTotal.font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${nomeArquivo}-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  })
}
