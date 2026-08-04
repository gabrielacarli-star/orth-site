// Tipos do "episodio.json" — a receita de um episódio.
//
// O episodio.json é a única fonte de verdade de um episódio: os scripts em
// Python (música, vozes, efeitos) leem ele, e a animação aqui do Remotion
// lê ele. Mudou o JSON, mudou o vídeo — não precisa mexer em código.

/** Personagens disponíveis. Adicionar um novo = criar o componente e listar aqui. */
export type NomePersonagem = "maria" | "pipo" | "nina" | "bolha";

/** Cenários fixos da Ilha Pipoca (Fase 2, seção 3). */
export type NomeCenario = "praia" | "coqueiral" | "casa-da-arvore" | "ceu-noturno";

/** Um personagem posicionado em cena. */
export type PersonagemEmCena = {
  quem: NomePersonagem;
  /** Posição horizontal, 0 = borda esquerda, 1 = borda direita. */
  x: number;
  /** Posição vertical, 0 = topo, 1 = base. Chão da praia fica por volta de 0.72. */
  y: number;
  /** Tamanho relativo. 1 = tamanho padrão do personagem. */
  escala?: number;
  /** Se true, a boca abre e fecha no ritmo (usado quando o personagem canta). */
  cantando?: boolean;
  /** Espelha horizontalmente — use pra o personagem "olhar" pro outro lado. */
  espelhado?: boolean;
};

/** Um trecho contínuo do episódio. */
export type Cena = {
  /** Início em segundos, contado do começo do episódio. */
  de: number;
  /** Fim em segundos. */
  ate: number;
  cenario: NomeCenario;
  personagens: PersonagemEmCena[];
  /**
   * Linha da letra exibida na tela nesse trecho. Legenda em vídeo infantil
   * ajuda alfabetização e aumenta muito o tempo de exibição (pai canta junto).
   * Deixe vazio pra não mostrar nada.
   */
  legenda?: string;
};

/** A receita completa do episódio. */
export type Episodio = {
  id: string;
  titulo: string;
  /** "dia" = música de aprendizado; "noite" = ninar (ver Fase 1, seção 3). */
  pilar: "dia" | "noite";
  /**
   * Ritmo brasileiro deste episódio: "baião", "samba leve", "xote",
   * "frevo", "maracatu suave", "viola".
   *
   * Existe pra que dez episódios não saiam com a mesma música. Ritmo
   * repetido é o que a política de conteúdo inautêntico do YouTube
   * descreve como "pouca ou nenhuma variação" — e é o oposto do que a
   * Fase 2 define como identidade sonora do canal.
   */
  ritmo?: string;
  fps: number;
  duracaoSegundos: number;
  /** Nome do arquivo de áudio dentro de public/. Vazio = renderiza mudo. */
  audio?: string;
  cenas: Cena[];
};
