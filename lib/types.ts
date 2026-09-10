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
  perfis: Pick<Perfil, "nome"> | null
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
