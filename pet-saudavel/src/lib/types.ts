// Tipos do domínio + esquema mínimo do banco para o supabase-js.
// Espelha as tabelas criadas em supabase/migrations/0001_init.sql e 0002_cartao_emergencia.sql.

export type Especie = "cao" | "gato" | "outro"
export type TipoAntiparasitario = "vermifugo" | "pulga" | "carrapato"

export interface Pet {
  id: string
  user_id: string
  nome: string
  especie: Especie | null
  raca: string | null
  nascimento: string | null // ISO date
  alergias: string | null
  foto_url: string | null
  created_at: string
  // Cartão de emergência (0002_cartao_emergencia.sql)
  condicoes_saude: string | null
  medicacao_continua: string | null
  vet_nome: string | null
  vet_telefone: string | null
  emergencia_24h_telefone: string | null
  emergencia_24h_endereco: string | null
}

export interface Vacina {
  id: string
  pet_id: string
  nome: string
  data_aplicacao: string
  proxima_dose: string | null
  observacao: string | null
}

export interface Antiparasitario {
  id: string
  pet_id: string
  tipo: TipoAntiparasitario | null
  produto: string | null
  data_aplicacao: string
  intervalo_dias: number
  proxima_dose: string | null
}

export interface Peso {
  id: string
  pet_id: string
  data: string
  peso_kg: number
}

export interface Produto {
  id: string
  hotmart_product_id: string | null
  titulo: string
  descricao: string | null
  capa_url: string | null
  arquivo_path: string | null
  link_compra: string | null
  ativo: boolean
  desbloqueia_sos: boolean
}

// Conteúdo protegido do SOS (tabela sos_conteudo). Só chega ao app via
// Edge Function "sos-conteudo", nunca direto do banco pelo cliente.
export interface SosConteudo {
  slug: string
  sinais: string[]
  passos: string[]
  nunca_faca: string | null
  levar_ao_vet: string | null
}

export interface Compra {
  id: string
  user_id: string | null
  email_compra: string
  hotmart_product_id: string
  status: "ativo" | "reembolsado"
  criado_em: string
}

// Item unificado da home ("Próximos cuidados").
export interface Cuidado {
  id: string
  petId: string
  petNome: string
  tipo: "vacina" | "vermifugo" | "pulga" | "carrapato"
  titulo: string
  data: string // ISO date da próxima dose
}

