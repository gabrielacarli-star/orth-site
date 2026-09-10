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
  ordem: number
  created_at: string
}

export interface Config {
  id: true
  comissao_percentual_padrao: number
  updated_at: string
}
