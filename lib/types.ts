export type Role = "admin" | "vendedor"

export interface Perfil {
  id: string
  role: Role
  nome: string
  created_at: string
}

export interface Vendedor {
  id: string
  cpf: string | null
  cnpj: string | null
  telefone: string | null
  comissao_percentual: number
  ativo: boolean
  created_at: string
}

export interface VendedorComPerfil extends Vendedor {
  perfis: Pick<Perfil, "nome" | "role"> | null
  email?: string
}

export interface Venda {
  id: string
  vendedor_id: string
  cliente_nome: string
  servico: string
  valor_venda: number
  valor_setup: number | null
  valor_mensalidade: number | null
  valor_setup_liquido: number | null
  data_recebimento_setup: string | null
  comissao_percentual: number
  comissao_valor: number
  comprovante_path: string | null
  contrato_path: string | null
  status_comissao: "pendente" | "paga"
  data_venda: string
  observacoes: string | null
  created_at: string
}

export interface Agendamento {
  id: string
  vendedor_id: string
  titulo: string
  cliente_nome: string | null
  data_hora: string
  duracao_minutos: number
  notas: string | null
  status: "agendado" | "concluido" | "cancelado"
  created_at: string
}

export type StatusCliente = "novo" | "em_contato" | "proposta_enviada" | "fechado" | "perdido"

export interface Cliente {
  id: string
  vendedor_id: string
  nome: string
  telefone: string | null
  email: string | null
  empresa: string | null
  origem: string | null
  status: StatusCliente
  notas: string | null
  proposta_enviada: boolean
  proposta_valor: number | null
  proposta_produtos: string | null
  proposta_data: string | null
  created_at: string
}

export interface TabelaPreco {
  id: string
  servico: string
  valor_descricao: string
  condicao_pagamento: string | null
  valor_minimo: number | null
  ordem: number
  created_at: string
}

export interface Config {
  id: true
  comissao_percentual_padrao: number
  updated_at: string
}

/** Nunca inclua refresh_token/access_token aqui: essa interface é usada em queries
 * que rodam com sessão do vendedor, e essas colunas não devem chegar no cliente. */
export interface GoogleNegocioConexao {
  id: string
  cliente_id: string
  vendedor_id: string
  google_email: string | null
  location_display_name: string | null
  descricao_negocio: string | null
  palavras_chave: string | null
  ativo: boolean
  ultimo_post_em: string | null
  ultimo_erro: string | null
  created_at: string
}

/** senha_cifrada nunca deve chegar ao cliente em texto puro fora de uma ação explícita de revelar. */
export interface SenhaAcesso {
  id: string
  titulo: string
  usuario: string | null
  url: string | null
  notas: string | null
  criado_por: string | null
  created_at: string
  updated_at: string
}

export type TipoLancamento = "receita" | "despesa"
export type StatusLancamento = "pendente" | "pago"

export interface FinanceiroLancamento {
  id: string
  tipo: TipoLancamento
  descricao: string
  valor: number
  categoria: string | null
  cliente_nome: string | null
  recorrente: boolean
  data_prevista: string
  data_pago: string | null
  status: StatusLancamento
  criado_por: string | null
  created_at: string
  updated_at: string
}

export interface GoogleNegocioPost {
  id: string
  conexao_id: string
  conteudo: string
  status: "publicado" | "erro"
  erro_mensagem: string | null
  created_at: string
}
