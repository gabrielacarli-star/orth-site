// Tipos do domínio + esquema mínimo do banco para o supabase-js.
// Espelha as tabelas criadas em supabase/migrations/0001_init.sql.

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

