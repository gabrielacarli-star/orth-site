import { supabase } from "./supabase"

// Confere se o tutor logado tem alguma compra ativa de um produto marcado
// como "desbloqueia_sos". Só decide o que a UI mostra (ícone de cadeado);
// quem garante o acesso de verdade é a Edge Function "sos-conteudo".
export async function checkSosAccess(): Promise<boolean> {
  const { data: produtosLiberadores } = await supabase
    .from("produtos")
    .select("hotmart_product_id")
    .eq("desbloqueia_sos", true)
    .eq("ativo", true)

  const ids = (produtosLiberadores ?? [])
    .map((p) => p.hotmart_product_id as string | null)
    .filter((v): v is string => Boolean(v))
  if (ids.length === 0) return false

  const { data: compras } = await supabase
    .from("compras")
    .select("id")
    .eq("status", "ativo")
    .in("hotmart_product_id", ids)
    .limit(1)

  return (compras?.length ?? 0) > 0
}
