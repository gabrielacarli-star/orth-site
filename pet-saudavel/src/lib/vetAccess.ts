import { supabase } from "./supabase"

// Confere se o usuário logado é um veterinário cadastrado. Só decide o
// que a UI mostra (o link "Área do Veterinário"); quem garante o acesso
// de verdade são as Edge Functions "vet-buscar-pet" e
// "vet-registrar-cuidado", que conferem de novo com service_role.
export async function checkVetAccess(): Promise<boolean> {
  const { data } = await supabase.from("veterinarios").select("user_id").eq("ativo", true).maybeSingle()
  return Boolean(data)
}
